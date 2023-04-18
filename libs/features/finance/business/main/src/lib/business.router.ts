import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

const BUSINESS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'invoices',
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
