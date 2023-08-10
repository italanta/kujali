import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { flatMap as __flatMap, groupBy as __groupBy } from 'lodash';

import { BudgetLineUI } from '../../model/budget-line-view.interface';
import { OperationsBudgetsModel } from '../../model/operations-budget.model';
import { resetBudgetAnalysisAggregate } from '../../model/budget-analysis-aggregate.interface';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

import { CreateExpensesModalComponent } from '@app/features/finance/operations/expenses/main';

import { CompareBudgetsModalComponent } from '../../modals/compare-budgets-modal/compare-budgets-modal.component';
import { AllocateInvoiceToLineModalComponent } from '../../modals/allocate-invoice-to-line-modal/allocate-invoice-to-line-modal.component';

import { OperationsBudgetsModelService } from '../../services/operations-budgets.service';

@Component({
  selector: 'app-operations-budgets-page',
  templateUrl: './operations-budgets-page.component.html',
  styleUrls: ['./operations-budgets-page.component.scss'],
})
export class OperationsBudgetsPageComponent implements OnInit, OnDestroy {

  public model: OperationsBudgetsModel;
  
  displayedColumns: string[] = ['name', 'total', 'expenses', 'invoices', 'actions'];

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _opsBudgetsModelService: OperationsBudgetsModelService
  ) { }

  ngOnInit(): void {
    this.model = this._opsBudgetsModelService.initModalState();
    this.model.getAllTras();
  }

  budgetChanged(budget: MatSelectChange) {
    this.model.agg = resetBudgetAnalysisAggregate();
    this.model.activeBudget = budget.value;
    this.model.budgetValue$.next(budget.value);
  }

  yearChanged(year: MatSelectChange) {
    this.model.agg = resetBudgetAnalysisAggregate();
    this.model.activeYear = year.value;
    this.model.yearValue$.next(year.value);
  }

  monthChanged(month: MatSelectChange) {
    this.model.agg = resetBudgetAnalysisAggregate();
    this.model.activeMonth = (month.value.month - 1).toString();
    this.model.month = month.value;
    this.model.monthValue$.next(month.value);
  }

  absolute = (number: number) => Math.abs(number);

  allocateLineToInvoice(line: BudgetLineUI) {
    this._dialog.open(AllocateInvoiceToLineModalComponent, {
      minWidth: '700px',
      data: { budgetLine: line }
    });
  }

  goToAllocation(mode: 1 | -1, id: string) {
    if (mode === 1)
      this._router$$.navigate(['business/invoices', id, 'edit']);
    else
      this._router$$.navigate(['operations/expenses']);
  }

  compareBudgets() {
    this._dialog.open(CompareBudgetsModalComponent, {
      minWidth: '1000px',
      minHeight: '800px',
    });
  }

  addExpense(plan: TransactionPlan) {
    this._dialog.open(CreateExpensesModalComponent, {
      minWidth: '700px', minHeight: 'fit-content', 
      data: {
        budget: this.model.activeBudget, 
        year: this.model.activeYear, 
        month: this.model.month,
        plan: plan
      }
      });
  }
  addInvoice() {}

  ngOnDestroy(): void {
    this._opsBudgetsModelService.endModelState();
  }
}
