import { HandlerTools, Repository } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';

import { HttpsContext } from "@ngfi/functions";
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { BankConnectionAccountType } from '@app/model/finance/banking';
import { PontoAccount, PontoConnection } from "@app/model/finance/banking/ponto";

import { PontoSynchronization } from "../../model/ponto-sync.interface";
import { PontoConnectUtilityService } from "../../base/ponto-util.service";


const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) => `orgs/${orgId}/bank-connections`;

export class TriggerPontoSyncHandler extends FunctionHandler<{ orgId: string, orgAccId: string, customerIp: string}, PontoSynchronization>
{
  public async execute(data: { orgId: string, orgAccId: string, customerIp: string}, context: HttpsContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Triggering Ponto synchronization. Data: ${JSON.stringify(data)}`);
    // Step 1. Get Subject Bank Account
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection | null = connections.length > 0 ? connections[0] : null;

    if(!pontoConnection) return;
    tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Fetched Ponto connection  orgId ${data.orgId}, Conn id${pontoConnection?.id}`);

    const pontoAccount = pontoConnection.accounts.find(acc => acc.sysAccId === data.orgAccId);
    tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Identified ponto account. orgId ${data.orgId} BankAccId: ${pontoAccount?.bankAccId}`);

    if(!pontoAccount) return;

    // Step 2. Fetch and update user access code
    const pontoUtilityService = new PontoConnectUtilityService(tools.Logger);

    tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Fetching user access.`);
    const userAccess = await pontoUtilityService.getPontoUserAccess(data.orgId, data.orgAccId);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[TriggerPontoSyncHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 3. Create sync object
    const endpoint = process.env['PONTO_IBANITY_API_ENDPOINT'] + 'synchronizations';
    const createSyncPayload = {
        type: "synchronization",
        attributes: {
          resourceId: pontoAccount.bankAccId,
          resourceType: "account",
          subtype: 'accountTransactions',
          customerIpAddress: data.customerIp,
        }
    };

    tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Fetched user access: ${ JSON.stringify(createSyncPayload) }.`);

    try{
      tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Creating ponto sync. orgId ${data.orgId} Payload data: ${JSON.stringify(createSyncPayload)}`);
      const syncObject = await pontoUtilityService.makePontoPostRequest(createSyncPayload, endpoint, userAccess);

      tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: Sync object created. orgId ${data.orgId} new object: ${JSON.stringify(syncObject?.data)}`);
      return syncObject?.data;
    } catch (err: any) {
      const accessCodeFromList = err?.errors?.find(error => error === 'accountRecentlySynchronized');
      const accessCodeErr = err?.error === 'accountRecentlySynchronized';

      if(!!accessCodeErr || !!accessCodeFromList){
        tools.Logger.log(() => `[TriggerPontoSyncHandler].execute: ⚠️⚠️⚠️⚠️⚠️ Too many subsequent requests. Retry after a few minutes! orgId ${data.orgId}. Error: ${JSON.stringify(err)}`);
      }
    }
  }
}
