import { Allocation } from "@app/model/finance/allocations";
import { Invoice } from "@app/model/finance/invoices";
import { Payment } from "@app/model/finance/payments";

import { CALC_INV_TOTAL } from "./calculate-invoice-totals.function";

export function REDUCE_INVOICE_ALLOC_AMOUNT(payment: Payment, invoices: Invoice[]): Allocation[] {
  let paymentAmount = payment.amount;
  return invoices.map((invoice) => {
    const invoiceAmount = CALC_INV_TOTAL(invoice)
    let allocs = {
      pId: payment.id!,
      invId: invoice.id!,
      trType: 1,
      amount: paymentAmount > invoiceAmount ? invoiceAmount : paymentAmount,
    }
    paymentAmount -= allocs.amount;
    return allocs;
  })
}