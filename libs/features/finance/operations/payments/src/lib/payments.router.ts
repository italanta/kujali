import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';

const OPERATIONS_PAYMENTS_ROUTES: Route[] = [
  {
    path: '',
    component: PaymentsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_PAYMENTS_ROUTES)],
  exports: [RouterModule]
})
export class PaymentsRouterModule { }
