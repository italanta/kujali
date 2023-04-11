import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { BankTransaction } from '@app/model/finance/payments';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';

import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';

import { AllocatePaymentsService } from '../services/allocate-payments.service';
import { AllocateInvoicesService } from '../services/allocate-invoices.service';

const PAYMENTS_REPO = (orgId: string) => `orgs/${orgId}/payments`;
const PAYMENT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/payments-allocs`;

const INVOICES_REPO = (orgId: string) => `orgs/${orgId}/invoices`;
const INVOICES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/invoices-allocs`;

/**
 * @class AllocateBankPaymentsHandler.
 *
 * @description Creates a payment allocation for a given bank transaction.

 */
export class AllocateBankPaymentsHandler extends FunctionHandler<{ orgId: string, allocs: Allocation[]}, InvoiceAllocation[]>
{
  public async execute(data: { orgId: string, allocs: Allocation[]}, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AllocateBankPaymentsHandler].execute: allocating payments for: ${data.orgId}`);


    // step 1. get payment
    tools.Logger.log(() => `[AllocateBankPaymentsHandler].execute: selected payment: ${data.allocs[0].pId}`);
    const paymentRepo =  tools.getRepository<BankTransaction>(PAYMENTS_REPO(data.orgId));
    const payment = await paymentRepo.getDocumentById(data.allocs[0].pId);

    // step 2. get invoices
    const invoicesRepo =  tools.getRepository<Invoice>(INVOICES_REPO(data.orgId));
    const selectedInvoices: string[] = data.allocs.map((a) => a.invId);

    tools.Logger.log(() => `[AllocateBankPaymentsHandler].execute: selected invoices: ${selectedInvoices}`);

    const invoices = await invoicesRepo.getDocuments(new Query().where('id', 'in', selectedInvoices));

    // step 3. create payment allocation
    const _paymentAllocsService = new AllocatePaymentsService(tools.Logger);

    const paymentAllocsRepo =  tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(data.orgId));
    const paymentAlloc = _paymentAllocsService.createPaymentAllocation(payment, invoices, data.allocs);
    await paymentAllocsRepo.write(paymentAlloc, paymentAlloc.id);


    // step 4. create invoice allocations
    const _invoiceAllocsService = new AllocateInvoicesService(tools.Logger);
    const invAllocsRepo =  tools.getRepository<InvoiceAllocation>(INVOICES_ALLOCS_REPO(data.orgId));

    const allocatedInvoices = invoices.map((i) => _invoiceAllocsService.createInvoiceAllocation(payment, i, data.allocs, invAllocsRepo));

    const allInvs = await Promise.all(allocatedInvoices);

    tools.Logger.log(() => `[AllocateBankPaymentsHandler].execute: created invoice allocations for invoices: ${allocatedInvoices.length}`);

    const invAlloc = allInvs.map(i => invAllocsRepo.write(i, i.id!));

    const alloInvoices$ = await Promise.all(invAlloc);
    return alloInvoices$;
  }
}