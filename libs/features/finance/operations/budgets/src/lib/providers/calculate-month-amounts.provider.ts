import { Invoice, InvoiceAllocation } from "@app/model/finance/invoices";
import { Expenses, ExpensesAllocation } from "@app/model/finance/operations/expenses";

export function CALCULATE_ALLOCATED_COSTS (expenses: Expenses[], expAllocs: ExpensesAllocation[]) {
  let total = 0;
  if (expenses?.length > 0) {
    expenses.map((exp) => {
      let alloc = expAllocs.find((alloc) => alloc.id === exp.id);
      total = total + alloc?.elements?.reduce((acc, alloc) => acc + alloc.allocAmount, 0)!;
    })

    return total;
  }
  return 0;
}

export function CALCULATE_ALLOCATED_INCOME (invoices: Invoice[], invAllocs: InvoiceAllocation[]) {
  let total = 0;
  if (invoices?.length > 0) {
    invoices.map((inv) => {
      let alloc = invAllocs.find((alloc) => alloc.id === inv.id);
      total = alloc?.elements?.reduce((acc, alloc) => acc + alloc.allocAmount, 0)!;
    })

    return total;
  }
  return 0;
}