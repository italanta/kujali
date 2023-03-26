import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesStore } from './stores/companies.store';
import { ActiveCompanyStore } from './stores/active-company.store';

@NgModule({
  imports: [CommonModule],
})
export class CompaniesStateModule {
  static forRoot(): ModuleWithProviders<CompaniesStateModule> {
    return {
      ngModule: CompaniesStateModule,
      providers: [
        CompaniesStore,
        ActiveCompanyStore
      ]
    };
  }
}