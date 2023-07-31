import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessAccountsGuard, CanAccessBudgetsGuard, 
      CanAccessExpensesGuard, 
      CanAccessPaymentsGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'accounts',
    pathMatch: 'full'
  },
  {
    path: 'accounts',
    loadChildren: () => import('@app/features/finance/operations/accounts/main').then(m => m.OperationsAccountsModule),
    canActivate: [IsLoggedInGuard, CanAccessAccountsGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('@app/features/finance/operations/payments').then(m => m.OperationsPaymentsModule),
    canActivate: [IsLoggedInGuard, CanAccessPaymentsGuard]
  },
  {
    path: 'expenses',
    loadChildren: () => import('@app/features/finance/operations/expenses').then(m => m.OperationsExpensesModule),
    canActivate: [IsLoggedInGuard, CanAccessExpensesGuard]
  },
  {
    path: 'budgets',
    loadChildren: () => import('@app/features/finance/operations/budgets/main').then(m => m.OperationsBudgetsModule),
    canActivate: [IsLoggedInGuard, CanAccessBudgetsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsRouterModule { }
