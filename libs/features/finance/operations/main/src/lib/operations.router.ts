import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { OperationsPageComponent } from './pages/operations-page/operations-page.component';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'banking',
  },
  {
    path: 'banking',
    loadChildren: () => import('@app/features/finance/banking/main').then(m => m.FinanceBankingModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('@app/features/finance/operations/payments').then(m => m.OperationsPaymentsModule),
    canActivate: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsRouterModule { }
