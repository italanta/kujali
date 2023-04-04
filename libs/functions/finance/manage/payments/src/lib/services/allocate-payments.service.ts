import { round as __round } from 'lodash';

import { Logger } from '@iote/cqrs';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

import { PaymentAllocation } from '../model/payment-allocation.interface';
import { PaymentAllocationElement } from '../model/payment-allocation-element.interface';

import { CALC_INV_TOTAL } from '../providers/calculate-invoice-total.function';

export class AllocatePaymentsService {

  constructor(private _logger: Logger) { }

  createPaymentAllocation(payment: Payment, invoices: Invoice[]): PaymentAllocation {

    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: creating payment allocation for payment: ${payment.id}`);
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: selected invoices are:  ${invoices.length}`);

    let paymentElements: PaymentAllocationElement[] = invoices.map(invoice => this.createPaymentAllocationElement(payment, invoice));
    const allocStatus = this.calculateAllocatedAmount(payment, invoices);

    let paymentAllocation: PaymentAllocation = {
      id: payment.id!,
      elements: paymentElements,
      allocStatus: allocStatus.status,
    }
    
    allocStatus.alloc?.balance ? paymentAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? paymentAllocation.credit = allocStatus.alloc.credit : null;

    return paymentAllocation;
  }

  createPaymentAllocationElement(payment: Payment, invoice: Invoice): PaymentAllocationElement {
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocationElement for:  ${payment.id} and ${invoice.id}`);

    let invAmount = CALC_INV_TOTAL(invoice);

    let paymentAllocationElement: PaymentAllocationElement = {
      pId: payment.id!,
      note: payment.notes!,
      date: payment.date!,
      accId: payment.from,
      accName: payment.fromAccName,
      allocAmount: invAmount,
      invoiceId: invoice.id!,
      invoiceTitle: invoice.title!,
      allocMode: 1
    }

    return paymentAllocationElement;
  }

  calculateAllocatedAmount(payment: Payment, invoices: Invoice[]) {
    this._logger.log(() => `[AllocatePaymentsService].calculateAllocatedAmount for payment amount:  ${payment.amount} and ${invoices.length} invoices`);

    let allocAmount = invoices.reduce((acc, invoice) => {
      return acc + CALC_INV_TOTAL(invoice);
    }, 0);

    this._logger.log(() => `[AllocatePaymentsService].calculateAllocatedAmount total inv allocs: ${allocAmount}`);
    
    if (allocAmount > payment.amount) {
      return {status: 5, alloc: {balance: allocAmount - payment.amount ?? -1}}
    } else if (allocAmount < payment.amount) {
      return {status: 5, alloc : {credit: payment.amount - allocAmount ?? -1}}
    } else {
      return {status: 1}
    }
  }
}
