import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';


import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { NotesModule } from '@app/features/notes'

import { ExpenseInformationComponent } from './components/expense-information/expense-information.component';
import { ExpenseDetailComponent } from './components/expense-detail/expense-detail.component';

import { ExpenseDetailPageComponent } from './pages/expense-detail-page/expense-detail-page.component';

import { ExpensesViewRouterModule } from './expenses-detail.router';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,

    PageHeadersModule,
    iTalPageModule,
    NotesModule,

    ExpensesViewRouterModule
  ],
  declarations: [
    ExpenseDetailPageComponent,
    ExpenseInformationComponent,
    ExpenseDetailComponent,
  ],
})
export class ExpensesViewModule {}
