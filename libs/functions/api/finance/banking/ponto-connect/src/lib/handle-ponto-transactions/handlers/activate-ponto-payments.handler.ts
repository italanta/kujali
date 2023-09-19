import { HandlerTools, Repository } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { PontoConnection } from '@app/model/finance/banking/ponto';

import { BankConnectionAccountType } from '@app/model/finance/banking';

import { PontoTransactionsService } from '../services/ponto-transactions.service';

const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) => `orgs/${orgId}/bank-connections`;

/**
 * @class ActivatePontoPaymentsHandler
 * @extends {FunctionHandler<{ orgId: string }, any>}
 *
 * @param orgId: organisation id
 * @param transaction: The new payment to be created
 *
 * Step 1. Get Ponto Connection
 * Step 2. Initialize Ponto services
 * Step 3. Fetch and update user access token
 * Step 4. Send payment activation request
 *
 */
export class ActivatePontoPaymentsHandler extends FunctionHandler<{ orgId: string, orgAccId: string, redirectUrl: string }, any>
{
  public async execute(data: { orgId: string, orgAccId: string, redirectUrl: string }, context: FunctionContext, tools: HandlerTools): Promise<any> {
    tools.Logger.log(() => `[ActivatePontoPaymentsHandler].execute: Data: ${JSON.stringify(data)}.`);

    // Step 1. Get Ponto Connection
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection | null = connections.length > 0 ? connections[0] : null;
    if(!pontoConnection) return;

    // Step 2. Initialize Ponto services
     const _pontoTransactionService = new PontoTransactionsService(tools.Logger);

    // Step 3. Fetch and update user access token
    tools.Logger.log(() => `[ActivatePontoPaymentsHandler].execute: Fetching user access.`);
    const userAccess = await _pontoTransactionService._utilityService.getPontoUserAccess(data.orgId, data.orgAccId);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[ActivatePontoPaymentsHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[ActivatePontoPaymentsHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 4. Send payment activation request
    tools.Logger.log(() => `[ActivatePontoPaymentsHandler].execute: Sending payment activation request.`);
    const res = await _pontoTransactionService.activatePayments(userAccess, data.redirectUrl);

    tools.Logger.log(() => `[ActivatePontoPaymentsHandler].execute: Result: ${ JSON.stringify(res) }`);
    return res?.data ?? null;
  }
}