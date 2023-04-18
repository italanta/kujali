import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

const BUSINESS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'invoices',
  },
  {
    path: 'contacts',
    loadChildren: () => import('@app/features/finance/business/contacts/main').then(m => m.BusinessContactModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'companies',
    loadChildren: () => import('@app/features/finance/business/companies').then(m => m.BusinessCompaniesModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'invoices',
    loadChildren: () => import('@app/features/finance/business/invoices/main').then(m => m.InvoicesModule),
    canActivate: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(BUSINESS_ROUTES)],
  exports: [RouterModule]
})
export class BusinessRouterModule { }
