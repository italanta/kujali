import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Timestamp } from '@firebase/firestore-types';

import { SubSink } from 'subsink';
import { Observable, combineLatest, switchMap, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Expenses } from '@app/model/finance/operations/expenses';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { Budget } from '@app/model/finance/planning/budgets';

import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';

@Component({
  selector: 'app-expense-information',
  templateUrl: './expense-information.component.html',
  styleUrls: ['./expense-information.component.scss']
})
export class ExpenseInformationComponent implements OnInit {

  private _sbS = new SubSink();

  expense$: Observable<Expenses>;
  budgets$: Observable<Budget[]>;
  plans$: Observable<TransactionPlan[]>;
  
  activeExpense: Expenses;
  activeBudget: Budget;
  activePlan: TransactionPlan;

  allDataLoaded = false;

  constructor(private _router$$: Router,
              private _expService: ExpensesStateService,
              private _budgetState: BudgetsStateService,
    ) { }

  ngOnInit(): void {
    this.expense$ = this._expService.getActiveExpense();
    this.budgets$ = this._budgetState.getAllBudgets();

    this._sbS.sink = combineLatest([this.expense$, this.budgets$]).pipe(
          tap(([expense, budgets]) => {
            this.activeExpense = expense;
            this.activeBudget = budgets.find(b => b.id === expense.budgetId)!}),
          switchMap(([expense, budgets]) => this._budgetState.getBudgetPlans(expense.budgetId!)),
          tap(plans => this.activePlan = plans.find(p => p.id === this.activeExpense.planId)!),
          tap(plans => this.allDataLoaded = true)).subscribe();
  }

  goToEdit(id: string) {

  }

  goToEditBudget() {
    this._router$$.navigate(['budgets', this.activeBudget.id, 'edit']);
  }

  getDate(date: Timestamp) {
    return __DateFromStorage(date).format('DD/MM/YYYY');
  }
}
