import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesStore } from './stores/invoices.store';
import { ActiveInvoiceStore } from './stores/active-invoice.store';
import { InvoicesPrefixStore } from './stores/invoice-prefix.store';

@NgModule({
  imports: [CommonModule],
})
export class InvoicesStateModule {
  static forRoot(): ModuleWithProviders<InvoicesStateModule> {
    return {
      ngModule: InvoicesStateModule,
      providers: [
        InvoicesStore,
        ActiveInvoiceStore,
        InvoicesPrefixStore
      ]
    };
  }
}
