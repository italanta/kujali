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

import { iTalPageModule } from '@app/elements/layout/page';
import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';

import { PaymentsRouterModule } from './payments.router';

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

    iTalPageModule,

    PaymentsRouterModule,
  ],
  declarations: [PaymentsPageComponent],
})
export class OperationsPaymentsModule {}
