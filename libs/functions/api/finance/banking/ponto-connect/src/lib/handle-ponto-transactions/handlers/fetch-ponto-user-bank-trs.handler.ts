import { HandlerTools, Repository } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { BankTransaction } from '@app/model/finance/payments';
import { PontoConnection } from '@app/model/finance/banking/ponto';
import { BankConnectionAccountType } from '@app/model/finance/banking';

import { PontoTransactionsService } from '../services/ponto-transactions.service';
import { PontoTrReducerService } from '../services/ponto-trs-reducer.service';

const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;

/**
 * @class FetchPontoTrsHandler.
 *
 * @description Fetches transactions from ponto and updates the tr store
 *
 * Step 1. Get Subject Bank Account
 *
 * Step 2. Fetch and update user access code
 *
 * Step 3. Fetch Transactions
 *
 * Step 4. Add new transactions to database
 */
export class FetchPontoUserBankTrsHandler extends FunctionHandler<{ orgId: string, orgAccId: string}, any>
{
  public async execute(data: { orgId: string, orgAccId: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Fetching ponto transactions for org ${data.orgId}`);

    // Step 1. Get Subject Bank Account
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection = connections.length > 0 ? connections[0] : null as any;
    
    if(!pontoConnection) return;

    const pontoAccount = pontoConnection.accounts.find(acc => acc.sysAccId === data.orgAccId);

    if(!pontoAccount) {
      tools.Logger.log(() => `[FetchPontoTrsHandler].execute: No associated account found for org ${data.orgId}, bankAccId ${data.orgAccId}`);
      return;
    }

    // Step 2. Fetch and update user access code
    const _pontoTransactionService = new PontoTransactionsService(tools.Logger);

    tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Fetching user access.`);
    const userAccess = await _pontoTransactionService._utilityService.getPontoUserAccess(data.orgId, data.orgAccId);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[FetchPontoTrsHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 3. Fetch Transactions
    tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Fetching transactions.`);

    // Get latest transaction id to use in request pagination parameter.
    const _pontoRepo = tools.getRepository<BankTransaction>(`orgs/${data.orgId}/ponto-transactions`);
    const latestTransaction = await _pontoRepo.getDocuments(new Query().where('from', '==', data.orgAccId).orderBy('date', 'desc').limit(1));

    // If it is the initial fetch, make recursive call to fetch all trs up to the start of the active fYear.
    const isInitialFetch = !latestTransaction.length;

    const recentTransactions = await _pontoTransactionService.fetchTransactions(userAccess.access_token, pontoAccount.bankAccId, isInitialFetch, latestTransaction[0]?.id ?? '');
    tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Fetched ${recentTransactions?.length} transactions from Ponto.`);

    // Step 4. Add new transactions to database
    tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Formatting ponto transactions.`);
    const _reducerService = new PontoTrReducerService();
    const updatedTrs: BankTransaction[] = _reducerService.convertToKujaliPayment(recentTransactions, pontoAccount.sysAccName!, pontoAccount.sysAccId, pontoAccount.iban);

    if(updatedTrs.length > 0)
    {
      const creates$ = updatedTrs.map(tr => _pontoRepo.write(tr, tr.id!));
      tools.Logger.log(() => `[FetchPontoTrsHandler].execute: Creating ${updatedTrs?.length } fetched Ponto transactions for account: ${ pontoAccount.bankAccId }.`);

      // Create normalized kujali payments from ponto transactions
      const _kujaliPaymentsRepo = tools.getRepository<BankTransaction>(`orgs/${data.orgId}/payments`);
      const kujaliPayments$ = updatedTrs.map(tr => this.createBankPayments(tr, _kujaliPaymentsRepo, tools));

      await Promise.all(kujaliPayments$);
      const updated = await Promise.all(creates$);

      return updated;
    }
  }

  createBankPayments(tr: BankTransaction, _kujaliPaymentsRepo: Repository<BankTransaction>, tools: HandlerTools) {
    tools.Logger.log(() => `[createBankPayments]: Creating bank payment fetched from Ponto transactions: ${ tr.id }.`);
    delete tr.originalTransaction;
    return _kujaliPaymentsRepo.write(tr, tr.id!);
  }
}