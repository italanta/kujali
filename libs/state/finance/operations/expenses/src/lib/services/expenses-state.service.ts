import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import * as moment from 'moment';

import { __DateFromStorage, __DateToStorage } from '@iote/time';

import { ExpenseAllocs, Expenses, ExpensesAllocation } from '@app/model/finance/operations/expenses';

import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { ActiveOrgStore } from '@app/state/organisation';

import { ExpensesStore } from '../stores/expenses.store';
import { ExpensesAllocsStore } from '../stores/expenses-allocs.store';

@Injectable({
  providedIn: 'root'
})
export class ExpensesStateService {

  constructor(private _aFF: AngularFireFunctions,
              private _expenses$$: ExpensesStore,
              private _activeOrg$$: ActiveOrgStore,
              private _expensesAllocs$$: ExpensesAllocsStore
  ) { }

  getAllExpenses(): Observable<Expenses[]> {
    return this._expenses$$.get();
  }

  getAllAlocatedExpenses(): Observable<Expenses[]> {
    return this._expenses$$.get().pipe(
      switchMap((expenses) => this._expensesAllocs$$.get().pipe(
        map((allocs) => expenses.filter((exp) => allocs.some((alloc) => alloc.id === exp.id)))
      ))
    );
  }

  getAllExpensesAllocs(): Observable<ExpensesAllocation[]> {
    return this._expensesAllocs$$.get();
  }

  getExpensesAndAllocs(): Observable<[Expenses[], ExpensesAllocation[]]> {
    return combineLatest([this.getAllExpenses(), this.getAllExpensesAllocs()])
  }

  createExpense(expense: FormGroup, allocated: boolean) {
    const expenseObject = this.createExpenseObject(expense.getRawValue(), allocated);

    if (allocated)
      return this._expenses$$.add(expenseObject).pipe(switchMap((exp) => this.allocateExpense(exp)));

    return this._expenses$$.add(expenseObject);
  }

  deleteExpense(expense: Expenses) {
    if (expense.allocated)
      return this._expenses$$.remove(expense).pipe(switchMap(() => this.removeExpenseAllocation(expense)));

    return this._expenses$$.remove(expense);
  }

  removeExpenseAllocation(expense: Expenses) {
    return this._activeOrg$$.get().pipe(switchMap((org) => this._aFF.httpsCallable('deleteExpenseProps')({orgId: org.id!, expense: expense})))
  }

  allocateExpense(expense: Expenses) {
    return this._activeOrg$$.get().pipe(
      map((org) => this.createExpBudgetLineAllocation(org.id!, expense)),
      switchMap((data) => this._aFF.httpsCallable('allocateExpenses')(data)));
  }

  createExpBudgetLineAllocation(orgId: string, expense: Expenses) {
    const month = __DateFromStorage(expense.date).month();
    const year = __DateFromStorage(expense.date).year();

    const lineId = `${year}-${month + 1}-${expense.lineId}`;

    const alloc: ExpenseAllocs = {
      amount: expense.amount,
      budgetLineId: lineId,
      expenseId: expense.id!,
    }
    return {orgId: orgId, expenseAlloc: alloc};
  }

  createExpenseObject(expense, allocated: boolean): Expenses {
    return {
      name: expense.name,
      amount: expense.amount,
      budgetId: allocated ? expense.budget.id : '',
      planId: allocated ? expense.plan.id : '',
      lineId: allocated ? expense.plan.lineId : '',
      date: __DateToStorage(moment(expense.date)),
      vat: expense.vat,
      note: expense.note,
      allocated: allocated,
    }
  }
}
