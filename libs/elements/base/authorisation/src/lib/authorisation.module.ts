import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsLoggedInGuard } from './auth-guards/is-logged-in.guard';
import { IsAdminGuard } from './auth-guards/is-admin.guard';
import { CanAccessCompaniesGuard } from './auth-guards/business/can-access-companies.guard';
import { CanAccessContactsGuard } from './auth-guards/business/can-access-contacts.guard';
import { CanAccessInvoicesGuard } from './auth-guards/business/can-access-invoices.guard';
import { CanAccessOpportunitiesGuard } from './auth-guards/business/can-access-opportunities.guard';
import { CanAccessCompaniesDetailGuard } from './auth-guards/business/can-access-companies-detail.guard';

/**
 * Authorisation module. Contains Auth Guards & Access Control Directives
 */
@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [],
  exports: [],
})
export class AuthorisationModule
{
  static forRoot(environment: any, production: boolean): ModuleWithProviders<AuthorisationModule>
  {
    return {
      ngModule: AuthorisationModule,
      providers: [
        IsLoggedInGuard,
        IsAdminGuard,
        CanAccessCompaniesGuard,
        CanAccessContactsGuard,
        CanAccessInvoicesGuard,
        CanAccessOpportunitiesGuard,
        CanAccessCompaniesDetailGuard
      ]
    };
  }
}
