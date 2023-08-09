import { Injectable } from '@angular/core';

import { Budget } from '@app/model/finance/planning/budgets';
import { ExpenseAllocs, Expenses } from '@app/model/finance/operations/expenses';

import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';

import { ExpenseUI } from '../model/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private _budgetsStateService: BudgetsStateService) { }

  combineExpensesAndExpensesAllocs(expenses: Expenses[], expensesAllocs: any[], budgets: Budget[]) {
    const ex = expenses.map((exp) => {
      const expAlloc = expensesAllocs.find((alloc) => alloc.id === exp.id);
      return { ...exp, ...expAlloc! };
    });

    return {budgets: budgets, expenses: ex};
  }

  findExpenseRecords(expenses: ExpenseUI[], budgets: Budget[]): ExpenseUI[] {
    return expenses.map((ex) => {
      const budget = budgets.find((b) => b.id === ex.budgetId);
      ex.budgetName = budget?.name;
      return ex;
    });
  }

  getPlans(id: string) {
    return this._budgetsStateService.getBudgetPlans(id);
  }
}
