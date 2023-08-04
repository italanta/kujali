import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { MultiLangModule } from '@ngfi/multi-lang';

import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { iTalPageModule } from '@app/elements/layout/page';
import { FormFieldsModule } from '@app/elements/forms/form-fields';

import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';

import { CreateNewBankAccountModalComponent } from './modals/create-new-bank-account-modal/create-new-bank-account-modal.component';

import { OperationsAccountsRouterModule } from './operations-accounts.router';
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
    UserStateModule,

    PageHeadersModule,
    iTalPageModule,
    FormFieldsModule,

    OperationsAccountsRouterModule,
  ],
  declarations: [
    AccountsPageComponent,
    CreateNewBankAccountModalComponent,
  ],
})
export class OperationsAccountsModule {}
