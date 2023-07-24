import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';

import { BudgetAnalysisComponent } from './components/budget-analysis/budget-analysis.component';
import { OperationsBudgetsPageComponent } from './pages/operations-budgets-page/operations-budgets-page.component';

import { CompareBudgetsModalComponent } from './modals/compare-budgets-modal/compare-budgets-modal.component';
import { AllocateInvoiceToLineModalComponent } from './modals/allocate-invoice-to-line-modal/allocate-invoice-to-line-modal.component';

import { OperationsBudgetsRouterModule } from './operations-budgets.router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,

    iTalPageModule,
    PageHeadersModule,

    OperationsBudgetsRouterModule,
  ],

  declarations: [
    OperationsBudgetsPageComponent,
    AllocateInvoiceToLineModalComponent,
    BudgetAnalysisComponent,
    CompareBudgetsModalComponent,
  ],
  providers: [BudgetPlansQuery],
})
export class OperationsBudgetsModule {}
