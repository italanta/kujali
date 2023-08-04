import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

// import { TransactionTypeManagementModule } from '../transaction-type-management/transaction-type-management.module';
// import { FinancialPlanExplorerModule } from '../financial-plan-explorer/financial-plan-explorer.module';

import { CreateBudgetModalComponent } from './components/create-budget-modal/create-budget-modal.component';
import { DisplayBudgetRecordComponent } from './components/display-budget-record/display-budget-record.component';
import { ShareBudgetModalComponent } from './components/share-budget-modal/share-budget-modal.component';
import { BudgetTableComponent } from './components/budget-table/budget-table.component';

import { SelectBudgetPageComponent } from './pages/select-budget/select-budget.component';

import { ChildBudgetsModalComponent } from './modals/child-budgets-modal/child-budgets-modal.component';
import { ManageBudgetAccessComponent } from './modals/manage-budget-access/manage-budget-access.component';

import { BudgetRouter } from './budget-router';
import { FormFieldsModule } from '@app/elements/forms/form-fields';
/**
 * Financial-Planning module. Contains financial planning creation and forecasting.
 */
@NgModule({
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MultiLangModule,

    iTalPageModule,
    PageHeadersModule,
    FormFieldsModule,

    BudgetsStateModule,

    BudgetRouter,
  ],

  declarations: [
    DisplayBudgetRecordComponent,
    CreateBudgetModalComponent,
    ShareBudgetModalComponent,

    SelectBudgetPageComponent,
    BudgetTableComponent,
    ChildBudgetsModalComponent,
    ManageBudgetAccessComponent,
  ],

  entryComponents: [CreateBudgetModalComponent, ShareBudgetModalComponent],
})
export class FinancialPlanningModule {}
