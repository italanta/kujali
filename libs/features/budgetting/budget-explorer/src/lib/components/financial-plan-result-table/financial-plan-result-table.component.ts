import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { isEqual as __isEqual, cloneDeep as __cloneDeep } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';

import { FinancialExplorerStateService } from '@app/state/finance/budgetting/rendering';

import { LinkBudgetModalComponent } from '../link-budget-modal/link-budget-modal.component';
import { PromptSaveBudgetChangesComponent } from '../../modals/prompt-save-budget-changes/prompt-save-budget-changes.component';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { Budget } from '@app/model/finance/planning/budgets';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';

@Component({
  selector: 'app-financial-plan-result-table',
  templateUrl: './financial-plan-result-table.component.html',
  styleUrls: ['./financial-plan-result-table.component.scss']
})
export class  FinancialPlanResultTableComponent implements OnInit, OnDestroy
{
  private _sBs!: Subscription;
  private _sbS = new SubSink()

  @Input() state$!: Observable<FinancialExplorerState>;
  @Input() budgetId: string;

  balanceTable$!: Observable<BudgetRowYear[]>;
  balance$!     : Observable<BudgetRowYear>;

  tableType = BudgetRowType.Result;

  budgetSubmitting: boolean = false;
  budgetActivating: boolean = false;

  previousState: FinancialExplorerState;

  constructor(private _router$$: Router, 
              private _dialog: MatDialog,
              private _budgetStateService: BudgetsStateService,
              private _bs: FinancialExplorerStateService)
  { }

  ngOnInit() {
    this.balanceTable$ = this.state$.pipe(map(res => [res.scopedCostTotals, res.scopedIncomeTotals].concat(res.scopedChildBudgets).concat([res.scopedResult])));
    this.balance$      = this.state$.pipe(map(res => res.scopedBalance));

    this.state$.pipe(take(1),
                    tap((state) => this.trackUserLeftTheExplorer(__cloneDeep(state))))
               .subscribe();
  }

  trackUserLeftTheExplorer(previousState: FinancialExplorerState) {
    this._sbS.sink = this._router$$.events.pipe(take(1), filter(event => event instanceof NavigationStart))
      .subscribe((event) => {
        const route = this._router$$.url;
        const budgetChanged = !__isEqual(previousState.budget, this._bs.getState().budget);
        const resultChanged = !__isEqual(previousState.scopedResult, this._bs.getState().scopedResult);
        if(route.includes('budgets') && route.split('/').length > 2 && (budgetChanged || resultChanged)) {
          this.promptUserToSaveChanges();
        }
      });
  }

  promptUserToSaveChanges() {
    this._dialog.open(PromptSaveBudgetChangesComponent, { disableClose: true }).afterClosed().subscribe((option) => {
      // if (option.event === 'saveChanges')
      //   this.submitBudget();
    })
  }

  linkChildModal() 
  {
    this._dialog.open( LinkBudgetModalComponent, 
        { data: this.budgetId })
    .afterClosed();
  }

  downloadExcelFile() {
    console.log('Service does not exist');
  }

  // activateBudget() {
  //   this.budgetActivating = true;
  //   this._bs.activateBudget().subscribe(() => this.budgetActivating = false);
  // }

  // deActivateBudget(budget: Budget) {
  //   this.budgetActivating = true;    
  //   this._budgetStateService.deActivateBudget(budget).subscribe(() => this.budgetActivating = false);
  // }

  // submitBudget() {
  //   this.budgetSubmitting = true;
  //   this._bs.submitBudget().subscribe(() => this.budgetSubmitting = false);
  // }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
    if(this._sBs)
      this._sBs.unsubscribe();
  }
}
