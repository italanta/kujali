import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [CommonModule],
})

export class PaymentsStateModule {
  static forRoot(): ModuleWithProviders<PaymentsStateModule> {
    return {
      ngModule: PaymentsStateModule,
      providers: [
        
      ]
    };
  }
}
