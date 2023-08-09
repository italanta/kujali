import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { OperationBudgetsQuery } from '@app/state/finance/budgetting/rendering';

import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';

import { FormFieldsModule } from '@app/elements/forms/form-fields';

import { ExpensesTableComponent } from './components/expenses-table/expenses-table.component';

import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';

import { CreateExpensesModalComponent } from './modals/create-expenses-modal/create-expenses-modal.component';

import { ExpensesService } from './services/expenses.service';

import { OperationsExpensesRouterModule } from './operations-expenses.router';

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

    PageHeadersModule,
    iTalPageModule,
    FormFieldsModule,

    OperationsExpensesRouterModule,
  ],
  declarations: [
    ExpensesPageComponent,
    CreateExpensesModalComponent,
    ExpensesTableComponent,
  ],
  providers: [OperationBudgetsQuery, BudgetPlansQuery, ExpensesService],
})
export class OperationsExpensesModule {}
