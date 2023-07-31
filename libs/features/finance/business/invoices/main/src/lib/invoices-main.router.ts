import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessInvoicesDetailGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';

const INVOICES_ROUTES: Route[] = [
  { path: '', component: InvoicesPageComponent },
  {
    path: 'create',
    loadChildren: () => import('libs/features/finance/business/invoices/details/view/src/lib/invoices-view.module').then(m => m.InvoicesViewModule),
  },
  {
    path: ':id/edit',
    loadChildren: () => import('libs/features/finance/business/invoices/details/view/src/lib/invoices-view.module').then(m => m.InvoicesViewModule),
    canActivate: [IsLoggedInGuard, CanAccessInvoicesDetailGuard]
  },
  {
    path: ':id/new-invoice',
    loadChildren: () => import('libs/features/finance/business/invoices/details/view/src/lib/invoices-view.module').then(m => m.InvoicesViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(INVOICES_ROUTES)],
  exports: [RouterModule]
})
export class InvoicesRouterModule { }
