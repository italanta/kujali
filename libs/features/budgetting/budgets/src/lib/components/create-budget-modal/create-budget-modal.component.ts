import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { cloneDeep as ___cloneDeep, range as ___range } from 'lodash';

import { Logger } from '@iote/bricks-angular';

import { MONTHS, TimeTableGenerator, YEARS } from '@app/model/finance/planning/time';
import { Budget, BudgetStatus } from '@app/model/finance/planning/budgets';
import { BudgetRow } from '@app/model/finance/planning/budget-lines';

import { BudgetsStore } from '@app/state/finance/budgetting/budgets';
import { BudgetLockService } from '@app/state/finance/budgetting/rendering';

import { CalculateBudgetHeaderService } from '@app/state/finance/budgetting/rendering';
import { CREATE_BUDGET_FORM } from '../model/create-budget-form.model';
@Component({
  selector: 'app-create-budget-modal',
  templateUrl: './create-budget-modal.component.html',
  styleUrls: ['./create-budget-modal.component.scss'],
})
/** Component responsible for budget creation. */
export class CreateBudgetModalComponent implements OnInit
{
  // - SECTION "CREATE FORM"

  createBudgetForm: FormGroup;
  /** If the budget has a child or note */
  hasChild!: boolean;

  /** Name of the budget */
  budgetName!: string;
  /** Start year of the budget */
  startYear: number = new Date().getFullYear();

  // - ENDSECTION
  // - SECTION "CREATE STUBS"

  /** Years in which the budget is active. Prepopulated with available years on the platform. */
  years = ___cloneDeep(YEARS);
  
  /** List of months of the budget. Prepopulated available months.
   *      Every month is further prepopulated with an empty amount for budget structuring. */
  months = ___cloneDeep(MONTHS).map((m, i) => { (<any>m).val = i; return m; });

  inYears = ___range(1, 11).map((v) => ({ name: v, val: v /* * 12*/ }));
  durationYear!: { name: number; val: number };
  duration: number = 5;

  // - ENDSECTION

  isSaving: boolean = false;

  constructor(private _fb: FormBuilder,
              private _budgets$$: BudgetsStore,
              private _budgetLockService: BudgetLockService,
              private _headersService: CalculateBudgetHeaderService,
              @Inject(MAT_DIALOG_DATA) public childBudget: Budget | false,
              public dialogRef: MatDialogRef<CreateBudgetModalComponent>,
              private _logger: Logger
  ){ }

  ngOnInit () {
    this.createBudgetForm = CREATE_BUDGET_FORM(this._fb);
    this.hasChild = !!this.childBudget;
  }

  onNoClick = () => this.dialogRef.close();

  onDurationYearSet = () => this.duration = this.durationYear.val;
  
  /** 
   * On form submit, this method creates the budget. 
   * 
   * Prepares the budget and adds it to the store.
   */
  createBudget(b: Budget) 
  {
    this.isSaving = true;
    let overrideList     : string[] = [];
    let overrideNameList : string[] = [];
    const childrenList   : string[] = [];

    if (this.childBudget) 
    {
      overrideList = (this.childBudget.overrideList.length > 0)
                        ? this.childBudget.overrideList 
                        : [];
      overrideList.push(this.childBudget.id as string);
      
      overrideNameList = this.childBudget.overrideNameList.length > 0 
                            ? this.childBudget.overrideNameList 
                            : [];
      overrideNameList.push(this.childBudget.name);
    }

    const budget = <Budget><unknown>{
      name: this.createBudgetForm.value.budgetName,
      startYear: this.createBudgetForm.value.startYear,
      startMonth: 0,
      duration: this.createBudgetForm.value.duration,
      restricted: this.createBudgetForm.value.restricted,
      accessibleBy: this.createBudgetForm.value.accessibleBy,

      // result: this._emptyBalance(),
      status: BudgetStatus.Open,

      overrideList,
      overrideNameList,
      childrenList,
    };

    // Add to store.
    this._budgets$$.add(budget).subscribe((budget) => {
      if (budget) {
        this._budgetLockService.createBudgetLock(budget);
        this._headersService.generateInitialBudgetHeader(budget);
        this.isSaving = false;
        this.dialogRef.close();
      }
    });
  }

  /** Generates a default result header for the budget. */
  private _emptyBalance(): BudgetRow 
  {
    const amountsYear = new TimeTableGenerator()
      .getTimeFrameSkeleton(this.startYear, this.duration)
      .map((y: any) => {
        return {
          year: y.year,
          total: 0,
          amountsMonth: y.months.map(() => {
            return { amount: 0, units: 0, baseAmount: 0 };
          }),
        };
      });

    return {
      isHeader: true,
      type: 'result',
      total: 0,
      name: 'BUDGET.TABLE.DEFS.RESULT-HEADER',
      amountsYear,
    };
  }
}
