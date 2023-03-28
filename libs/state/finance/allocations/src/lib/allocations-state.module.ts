import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [CommonModule],
})
export class AllocationsStateModule {
  static forRoot(): ModuleWithProviders<AllocationsStateModule> {
    return {
      ngModule: AllocationsStateModule,
      providers: [
      ]
    };
  }
}