import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessCompaniesGuard, CanAccessContactsGuard, CanAccessInvoicesGuard, 
          CanAccessOpportunitiesGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

const BUSINESS_ROUTES: Route[] = [
  {
    path: '', redirectTo: 'companies', pathMatch: 'full'
  },
  {
    path: 'contacts',
    loadChildren: () => import('libs/features/finance/business/contacts/main/src/lib/business-contacts.module').then(m => m.BusinessContactModule),
    canActivate: [IsLoggedInGuard, CanAccessContactsGuard]
  },
  {
    path: 'companies',
    loadChildren: () => import('libs/features/finance/business/companies/main/src/lib/companies-main.module').then(m => m.BusinessCompaniesModule),
    canActivate: [IsLoggedInGuard, CanAccessCompaniesGuard]
  },
  {
    path: 'opportunities',
    loadChildren: () => import('libs/features/finance/business/opportunities/main/src/lib/opportunities-main.module').then(m => m.financeOpportunitiesMainModule),
    canActivate: [IsLoggedInGuard, CanAccessOpportunitiesGuard]
  },
  {
    path: 'invoices',
    loadChildren: () => import('libs/features/finance/business/invoices/main/src/lib/invoices.module').then(m => m.InvoicesModule),
    canActivate: [IsLoggedInGuard, CanAccessInvoicesGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(BUSINESS_ROUTES)],
  exports: [RouterModule]
})
export class BusinessRouterModule { }
