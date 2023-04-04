import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

import { PaymentAllocation } from '@app/model/finance/allocations';

import { AllocatePaymentsService } from '../services/allocate-payments.service';
import { AllocateInvoicesService } from '../services/allocate-invoices.service';


const PAYMENT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/payments-allocs`;
const INVOICES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/invoices-allocs`;

/**
 * @class AllocateBankPaymentsHandler.
 *
 * @description Creates a payment allocation for a given bank transaction.

 */
export class AllocateBankPaymentsHandler extends FunctionHandler<any, boolean>
{
  public async execute(data: { orgId: string, payment: Payment, invoices: Invoice[]}, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AllocateBankPaymentsHandler].execute: allocating payments for: ${data.orgId}`);
    tools.Logger.log(() => `[AllocateBankPaymentsHandler].execute: selected invoices are: ${data.invoices.length}`);

    const _paymentAllocsService = new AllocatePaymentsService(tools.Logger);
    const _invoiceAllocsService = new AllocateInvoicesService();

    // step 1. create payment allocation
    const paymentAllocsRepo =  tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(data.orgId));
    const paymentAlloc = _paymentAllocsService.createPaymentAllocation(data['payment'], data['invoices']);
    await paymentAllocsRepo.write(paymentAlloc, paymentAlloc.id);


    // step 2. create invoice allocations

    return true;
  }
}