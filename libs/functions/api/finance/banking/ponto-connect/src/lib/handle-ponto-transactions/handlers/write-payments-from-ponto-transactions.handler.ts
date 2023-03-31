import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { DbMethods } from '@app/model/data/db';
import { FTransaction } from '@app/model/finance/payments';
import { PaymentBase, WritePaymentCommand } from '@app/model/finance/payments';


import { PontoTransaction } from 'libs/functions/api/finance/banking/ponto-connect/src/lib/model/ponto-transaction.interface';
import { PontoPayment } from '../../model/ponto-payment.interface';

/**
 * [WritePaymentHandler]
 * HTTP function handler for payment creations
 */
export class WritePaymentFromPontoTransaction extends FunctionHandler<WritePaymentCommand, boolean>
{
  public async execute(pontoTransaction: PontoPayment, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `Writing Payment`);

    const paymentsRepo = tools.getRepository<PaymentBase>(`orgs/${cmd.orgId}/payments`);

    const payment = await __PreparePaymentForStorage(paymentCmd, tools);


    return true;
  }
}


