import { ExpenseAllocs, Expenses } from "@app/model/finance/operations/expenses";

export interface ExpenseUI extends Expenses, ExpenseAllocs {
  budgetName?: string;
  planName?: string;
}