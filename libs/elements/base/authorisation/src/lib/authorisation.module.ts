import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsLoggedInGuard } from './auth-guards/is-logged-in.guard';
import { IsAdminGuard } from './auth-guards/is-admin.guard';

import { CanAccessCompaniesGuard } from './auth-guards/business/can-access-companies.guard';
import { CanAccessContactsGuard } from './auth-guards/business/can-access-contacts.guard';
import { CanAccessInvoicesGuard } from './auth-guards/business/can-access-invoices.guard';
import { CanAccessOpportunitiesGuard } from './auth-guards/business/can-access-opportunities.guard';
import { CanAccessCompaniesDetailGuard } from './auth-guards/business/can-access-companies-detail.guard';
import { CanAccessContactsDetailGuard } from './auth-guards/business/can-access-contacts-detail.guard';
import { CanAccessInvoicesDetailGuard } from './auth-guards/business/can-access-invoices-detail.guard';
import { CanAccessOpportunitiesDetailGuard } from './auth-guards/business/can-access-opportunities-detail.guard';

import { CanAccessAccountsGuard } from './auth-guards/operations/can-access.accounts.guard';
import { CanAccessAccountsDetailGuard } from './auth-guards/operations/can-access.accounts-detail.guard';
import { CanAccessExpensesGuard } from './auth-guards/operations/can-access.expenses.guard';
import { CanAccessExpensesDetailGuard } from './auth-guards/operations/can-access.expenses-detail.guard';
import { CanAccessPaymentsGuard } from './auth-guards/operations/can-access.payments.guard';
import { CanAccessPaymentsDetailGuard } from './auth-guards/operations/can-access.payments-detail.guard';
import { CanAccessBudgetsGuard } from './auth-guards/operations/can-access-budgets.guard';
import { CanAccessBudgetsDetailGuard } from './auth-guards/operations/can-access-budget-detail.guard';

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

        //guards
        IsLoggedInGuard,
        IsAdminGuard,

        //business routes
        CanAccessCompaniesGuard,
        CanAccessCompaniesDetailGuard,

        CanAccessContactsGuard,
        CanAccessContactsDetailGuard,

        CanAccessInvoicesGuard,
        CanAccessInvoicesDetailGuard,

        CanAccessOpportunitiesGuard,
        CanAccessOpportunitiesDetailGuard,

        // operations routes
        CanAccessAccountsGuard,
        CanAccessAccountsDetailGuard,

        CanAccessExpensesGuard,
        CanAccessExpensesDetailGuard,

        CanAccessPaymentsGuard,
        CanAccessPaymentsDetailGuard,

        CanAccessBudgetsGuard,
        CanAccessBudgetsDetailGuard
      ]
    };
  }
}
