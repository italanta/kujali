import { HandlerTools, Repository } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { BankConnectionAccountType } from '@app/model/finance/banking';
import { PontoAccount, PontoConnection } from "@app/model/finance/banking/ponto";
import { PaymentBase } from "@app/model/finance/payments";

import { PontoConfig } from "../../model/ponto-config.interface";
import { PontoTransactionsService } from "../services/ponto-transactions.service";

const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) => `orgs/${orgId}/bank-connections`;

/**
 * @class InitiatePontoPaymentHandler
 * @extends {FunctionHandler<{ orgId: string, transaction: PaymentBase, ibanTo: string}, any>}
 *
 * @param orgId: org id
 * @param transaction: The new payment to be created
 *
 * Step 1. Get Ponto Connection
 * Step 2. Initialize Ponto services
 * Step 3. Fetch and update user access token
 * Step 4. Update token value
 * Step 5. Send payment request
 *
 */
export class InitiatePontoPaymentHandler extends FunctionHandler<{ orgId: string, transaction: PaymentBase}, any>
{
  public async execute(data: { orgId: string; transaction: PaymentBase, redirectUrl: string }, context: FunctionContext, tools: HandlerTools): Promise<any> {
    tools.Logger.log(() => `[InitiatePontoPaymentHandler].execute: Creating Ponto PaymentBase object in org ${data.orgId}.`);

    // Step 1. Get Ponto Connection
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);

    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection | null = connections.length > 0 ? connections[0] : null;
    if(!pontoConnection) return;

    // Step 2. Initialize Ponto services
    const _pontoTransactionService = new PontoTransactionsService(tools.Logger);

    // Step 3. Fetch and update user access token
    tools.Logger.log(() => `[InitiatePontoPaymentHandler].execute: Fetching user access.`);
    const userAccess = await _pontoTransactionService._utilityService.getPontoUserAccess(data.orgId, pontoConnection.id!);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[InitiatePontoPaymentHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[InitiatePontoPaymentHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 5. Send payment request
    tools.Logger.log(() => `[InitiatePontoPaymentHandler].execute: Beginning transaction execution.`);
    const pontoAcc = pontoConnection.accounts.find(acc => acc.sysAccId === data.transaction.from) as PontoAccount;
    const res = await _pontoTransactionService.initiateCreditTransfer(userAccess, pontoAcc.bankAccId, data.transaction, data.redirectUrl);

    return res?.data ?? null;
  }
}