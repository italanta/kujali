import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { InvoicesDetailViewPageComponent } from './pages/invoices-detail-view-page/invoices-detail-view-page.component';

const INVOICES_DETAIL_ROUTES: Route[] = [
  { path: '', component: InvoicesDetailViewPageComponent },
  {
    path: 'invoices/:id/edit',
    component: InvoicesDetailViewPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(INVOICES_DETAIL_ROUTES)],
  exports: [RouterModule]
})
export class InvoicesViewRouterModule { }
