import { Invoice } from "@app/model/finance/invoices";
import { Expenses } from "@app/model/finance/operations/expenses";
import { BudgetLine, BudgetLinesAllocation } from "@app/model/finance/planning/budgets";

export interface BudgetLineAllocUI extends BudgetLine, BudgetLinesAllocation {}

export interface BudgetLineUI {
  amount: number;
  baseAmount: number;
  budgetName: string;
  lineName: string;
  lineId: string;
  planId: string;
  mode: 1 | -1;
  allocatedInvoices?: Invoice[];
  allocatedExpenses?: {allExp: Expenses[], allocatedExpenses: Expenses[]};
}