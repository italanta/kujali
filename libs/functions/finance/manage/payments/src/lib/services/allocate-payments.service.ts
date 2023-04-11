import { round as __round } from 'lodash';

import { Logger } from '@iote/cqrs';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';
import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';
import { PaymentAllocationElement } from '@app/model/finance/allocations';

export class AllocatePaymentsService {

  constructor(private _logger: Logger) { }

  createPaymentAllocation(payment: Payment, invoices: Invoice[], alloc: Allocation[]) {

    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: creating payment allocation for payment: ${payment.id}`);
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: selected invoices are :  ${invoices.length}`);

    let paymentElements: PaymentAllocationElement[] = invoices.map(invoice => this.createPaymentAllocationElement(payment, invoice, alloc));

    const allocStatus = this.calculateAllocatedAmount(payment, invoices, alloc);

    let paymentAllocation: PaymentAllocation = {
      id: payment.id!,
      elements: paymentElements,
      allocStatus: allocStatus.status,
    }
    
    allocStatus.alloc?.balance ? paymentAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? paymentAllocation.credit = allocStatus.alloc.credit : null;

    return paymentAllocation;
  }

  createPaymentAllocationElement(payment: Payment, invoice: Invoice, allocs: Allocation[]): PaymentAllocationElement {
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocationElement for:  ${payment.id} and ${invoice.id}`);

    const allocAmount = __round(allocs.find(alloc => alloc.invId === invoice.id)?.amount ?? 0, 2);

    let paymentAllocationElement: PaymentAllocationElement = {
      pId: payment.id!,
      note: payment.notes!,
      date: payment.date!,
      accId: payment.from,
      accName: payment.fromAccName,
      allocAmount: allocAmount,
      invoiceId: invoice.id!,
      invoiceTitle: invoice.title!,
      allocMode: 1
    }

    return paymentAllocationElement;
  }

  calculateAllocatedAmount(payment: Payment, invoices: Invoice[], allocatedAmount: Allocation[]) {
    this._logger.log(() => `[AllocatePaymentsService].calculateAllocatedAmount for payment amount:  ${payment.amount} and ${invoices.length} invoices`);

    let totalAllocatedAmount = allocatedAmount.reduce((acc, alloc) => {
      return acc + alloc.amount!;
    }, 0);

    if (totalAllocatedAmount < payment.amount) {
      return {status: 5, alloc : {credit: payment.amount -  totalAllocatedAmount ?? -1}}
    } else if (totalAllocatedAmount > payment.amount) {
      return {status: 5, alloc : {balance: payment.amount - totalAllocatedAmount ?? -1}}
    } else {
      return {status: 1};
    }
  }
}
