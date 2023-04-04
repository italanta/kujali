import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountPaymentsQuery } from './queries/account-payments.query';

import { PaymentsStateService } from './services/payments-state.service';

import { PaymentsStore } from './stores/payments.store';

@NgModule({
  imports: [CommonModule],
})

export class PaymentsStateModule {
  static forRoot(): ModuleWithProviders<PaymentsStateModule> {
    return {
      ngModule: PaymentsStateModule,
      providers: [
        AccountPaymentsQuery,
        PaymentsStateService,
        PaymentsStore
      ]
    };
  }
}
