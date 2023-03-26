import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRolesStore } from './stores/contact-roles.store';

@NgModule({
  imports: [CommonModule],
})
export class RolesStateModule {
  static forRoot(): ModuleWithProviders<RolesStateModule>
  {
    return {
      ngModule: RolesStateModule,
      providers: [
        ContactRolesStore,
      ]
    };
  }
}