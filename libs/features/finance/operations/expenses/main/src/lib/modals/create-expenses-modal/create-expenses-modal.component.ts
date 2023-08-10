import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import * as moment from 'moment';

import { Budget, BudgetLine } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

import { CostTypesStore } from '@app/state/finance/cost-types';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';

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
  isBudgetLineActive: boolean = true;

  budgetLine: BudgetLine;
  budgetAmountDifference: number = 0;

  activePlan: TransactionPlan;
  activeExpenseDate: moment.Moment = moment();

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _costTypes$$: CostTypesStore,
              private _plans$$: BudgetPlansQuery,
              private _budgetsStateService$$: BudgetsStateService,
              private _expensesStateService: ExpensesStateService,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.addNewExpenseFormGroup = CREATE_EXPENSE_FORM(this._fb, this.activeExpenseDate);
    this.getModalData();
  }

  ngAfterViewInit(): void {
    this.addNewExpenseFormGroup.controls['amount'].valueChanges.subscribe((amount) => {
      this.budgetAmountDifference = Math.abs(this?.budgetLine?.amount) ?? 0;
      if (amount && this.budgetLine)
        this.budgetAmountDifference = amount > 0 ? Math.abs(this.budgetLine.amount) - amount : this.budgetLine.amount;      
    })
  }

  getModalData() {
    if (!this.data) {
      this.getBudgets().subscribe();
    } else {      
      this.getBudgets().pipe(
        map((budgets) => budgets.find((budget) => budget.id === this.data.budget.id)),
        tap((budget) => this.addNewExpenseFormGroup.patchValue({budget: budget})),
        switchMap((budget) => this.getPlans(budget!)),
        tap((plans) => {
          this.activePlan = plans.find((plan) => plan.id === this.data.plan.planId)!;
          this.expenseAllocatedFromBudget();
        })).subscribe();
    }
  }

  expenseAllocatedFromBudget() {
    this.assignToBudget = true;
    this.addNewExpenseFormGroup.patchValue({date: new Date(`${this.data.year}/${this.data.month.month}/${1}`)});
    this.activeExpenseDate = moment(this.addNewExpenseFormGroup.value.date) as moment.Moment;

    this.addNewExpenseFormGroup.patchValue({allocated: true});
    this.addNewExpenseFormGroup.patchValue({plan: this.activePlan});
    this.addNewExpenseFormGroup.patchValue({amount: Math.abs(this.data.plan.amount)});

    this.setBudgetLine();
  }

  assignToBudgetChange = (assignToBudget: MatSlideToggleChange) => this.assignToBudget = assignToBudget.checked;

  budgetChanged = (budget: MatSelectChange) => this.getPlans(budget.value).subscribe();

  getBudgets() {
    return this._budgetsStateService$$.getAllBudgets()
                        .pipe(
                          map((budgets) => budgets.filter((budget) => budget.status === 1)),
                          tap((budgets) => { this.budgetsList = budgets}));
  }

  getPlans(budget: Budget) {
    return this._plans$$.getPlans(budget).pipe(
                        map((plans) => plans.filter((p) => p.mode == -1)),
                        tap((plans) => this.plans = plans));
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
    if (!this.assignToBudget || !this.activePlan || !this.activeExpenseDate) {
      this.budgetAmountDifference = 0;
      this.isBudgetLineActive = true;
      return;
    }
    const lineId = `${this.activeExpenseDate.year()}-${this.activeExpenseDate.month() + 1}-${this.activePlan.lineId}`;
    this._sbS.sink = this._budgetsStateService$$.getBudgetLineById(lineId).pipe(tap((budgetLine) => this.perfomAutoFillOperations(budgetLine))).subscribe();
  }

  perfomAutoFillOperations(budgetLine: BudgetLine) {
    if (!budgetLine) {
      this.isBudgetLineActive = false;
      this.budgetAmountDifference = 0;
      return;
    }
    this.budgetLine = budgetLine;
    this.budgetAmountDifference = Math.abs(this.budgetLine.amount);
    this.isBudgetLineActive = true;
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
