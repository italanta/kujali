import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveFinanceObjectLoader } from './active-finance-object-loader.service';

@NgModule({
  imports: [CommonModule],
  providers: []
})

export class FinanceBaseModule {

  static forRoot(): ModuleWithProviders<FinanceBaseModule>
  {
    return {
      ngModule: FinanceBaseModule,
      providers: [
        ActiveFinanceObjectLoader
      ]
    };
  }
}
