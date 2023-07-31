import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest, map, tap } from 'rxjs';
import * as moment from 'moment';

import { Budget, BudgetLine } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

import { CostTypesStore } from '@app/state/finance/cost-types';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CREATE_EXPENSE_FORM } from '../../model/create-expense-form.model';

@Component({
  selector: 'app-create-expenses-modal',
  templateUrl: './create-expenses-modal.component.html',
  styleUrls: ['./create-expenses-modal.component.scss'],
})
export class CreateExpensesModalComponent implements OnInit, AfterViewInit {

  private _sbS = new SubSink();

  addNewExpenseFormGroup: FormGroup;

  budgetsList: Budget[];
  plans: TransactionPlan[];

  creatingExpense: boolean = false;
  assignToBudget: boolean = false;

  budgetLine: BudgetLine;
  budgetAmountDifference: number = 0;

  activePlan: TransactionPlan;
  activeExpenseDate: moment.Moment = moment();

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _costTypes$$: CostTypesStore,
              private _plans$$: BudgetPlansQuery,
              private _budgetsStateService$$: BudgetsStateService,
              private _expensesStateService: ExpensesStateService
  ) { }

  ngOnInit(): void {
    this.addNewExpenseFormGroup = CREATE_EXPENSE_FORM(this._fb, this.activeExpenseDate);
    this.getModalData();
  }

  ngAfterViewInit(): void {
    this.addNewExpenseFormGroup.controls['amount'].valueChanges.subscribe((amount) => {
      this.budgetAmountDifference = Math.abs(this.budgetLine.amount)
      if (amount && this.budgetLine)
        this.budgetAmountDifference = amount > 0 ? Math.abs(this.budgetLine.amount) - amount : this.budgetLine.amount;      
    })
  }

  assignToBudgetChange = (assignToBudget: MatSlideToggleChange) => this.assignToBudget = assignToBudget.checked;

  budgetChanged(budget: MatSelectChange) {
    this._sbS.sink = this._plans$$.getPlans(budget.value).pipe(
                        tap((plans) => { 
                          this.plans = plans.filter((p) => p.mode == -1) 
                        })).subscribe();
  }

  plansSelected(plan: MatSelectChange) {
    this.activePlan = plan.value;
    this.setBudgetLine();
  }

  dateSelected(date) {
    this.activeExpenseDate = date.value as moment.Moment;
    this.setBudgetLine();
  }

  setBudgetLine() {
    const lineId = `${this.activeExpenseDate.year()}-${this.activeExpenseDate.month()}-${this.activePlan.lineId}`;
    this._sbS.sink = this._budgetsStateService$$.getBudgetLineById(lineId).pipe(tap((budgetLine) => this.perfomAutoFillOperations(budgetLine))).subscribe();
  }

  perfomAutoFillOperations(budgetLine: BudgetLine) {
    this.budgetLine = budgetLine;
    this.budgetAmountDifference = Math.abs(this.budgetLine.amount);
  }

  getModalData() {
    this._sbS.sink = combineLatest([this._budgetsStateService$$.getAllBudgets(), this._costTypes$$.getOfType(-1)])
                        .subscribe(([budgets, costTypes]) => {
                          if (budgets) {
                            this.budgetsList = budgets.filter((budget) => budget.status === 1);
                          }
                        })
  }

  getAmountDifference() {}

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  submitExpense() {
    this.creatingExpense = true;
    this._expensesStateService.createExpense(this.addNewExpenseFormGroup, this.assignToBudget).subscribe(() => {
      this.creatingExpense = false;
      this._dialog.closeAll();
    });
  }
}
