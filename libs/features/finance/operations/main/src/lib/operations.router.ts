import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { OperationsPageComponent } from './pages/operations-page/operations-page.component';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'accounts',
    pathMatch: 'full'
  },
  {
    path: 'accounts',
    loadChildren: () => import('@app/features/finance/operations/accounts/main').then(m => m.OperationsAccountsModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('@app/features/finance/operations/payments').then(m => m.OperationsPaymentsModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'expenses',
    loadChildren: () => import('@app/features/finance/operations/expenses').then(m => m.OperationsExpensesModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'budgets',
    loadChildren: () => import('@app/features/finance/operations/budgets').then(m => m.OperationsBudgetsModule),
    canActivate: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsRouterModule { }
