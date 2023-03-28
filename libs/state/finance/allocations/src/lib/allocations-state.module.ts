import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocationsStore } from './stores/allocations.store';

@NgModule({
  imports: [CommonModule],
})
export class AllocationsStateModule {
  static forRoot(): ModuleWithProviders<AllocationsStateModule> {
    return {
      ngModule: AllocationsStateModule,
      providers: [
        AllocationsStore
      ]
    };
  }
}