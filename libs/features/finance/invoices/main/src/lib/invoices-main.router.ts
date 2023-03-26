import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';

const INVOICES_ROUTES: Route[] = [
  { path: '', component: InvoicesPageComponent },
  {
    path: 'create',
    loadChildren: () => import('libs/features/finance/invoices/details/view/src/lib/finance-invoices-details-view.module').then(m => m.financeInvoicesDetailsViewModule),
  },
  {
    path: ':id/edit',
    loadChildren: () => import('libs/features/finance/invoices/details/view/src/lib/finance-invoices-details-view.module').then(m => m.financeInvoicesDetailsViewModule),
  },
  {
    path: ':id/new-invoice',
    loadChildren: () => import('libs/features/finance/invoices/details/view/src/lib/finance-invoices-details-view.module').then(m => m.financeInvoicesDetailsViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(INVOICES_ROUTES)],
  exports: [RouterModule]
})
export class InvoicesRouterModule { }
