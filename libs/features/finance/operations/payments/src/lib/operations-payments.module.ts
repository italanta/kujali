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
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';

import { PaymentsRouterModule } from './payments.router';
import { CreateManualPaymentsModalComponent } from './modals/create-manual-payments-modal/create-manual-payments-modal.component';
import { MatSelectFilterModule } from 'mat-select-filter';

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
    MatSelectFilterModule,

    iTalPageModule,
    PageHeadersModule,

    PaymentsRouterModule,
  ],
  declarations: [PaymentsPageComponent, CreateManualPaymentsModalComponent],
})
export class OperationsPaymentsModule {}
