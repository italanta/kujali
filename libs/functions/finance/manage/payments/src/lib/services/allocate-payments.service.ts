import { Injectable } from '@angular/core';

import { round as __round } from 'lodash';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

import { PaymentAllocation } from '../model/payment-allocation.interface';
import { PaymentAllocationElement } from '../model/payment-allocation-element.interface';

import { CALC_INV_TOTAL } from '../providers/calculate-invoice-total.function';

@Injectable({
  providedIn: 'root'
})
export class AllocatePaymentsService {

  constructor() { }

  createPaymentAllocation(payment: Payment, invoices: Invoice[]): PaymentAllocation {

    let paymentElements: PaymentAllocationElement[] = invoices.map(invoice => this.createPaymentAllocationElement(payment, invoice));
    const allocStatus = this.calculateAllocatedAmount(payment, invoices);

    let paymentAllocation: PaymentAllocation = {
      id: payment.id!,
      elements: paymentElements,
      allocStatus: allocStatus.status,
      balance: allocStatus.alloc?.balance,
      credit: allocStatus.alloc?.credit
    }

    return paymentAllocation;
  }

  createPaymentAllocationElement(payment: Payment, invoice: Invoice): PaymentAllocationElement {
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
    let allocAmount = invoices.reduce((acc, invoice) => {
      return acc + CALC_INV_TOTAL(invoice);
    }, 0);

    if (allocAmount > payment.amount) {
      return {status: 5, alloc: {balance: allocAmount - payment.amount}}
    } else if (allocAmount < payment.amount) {
      return {status: 5, alloc : {credit: payment.amount - allocAmount}}
    } else {
      return {status: 1}
    }
  }
}
