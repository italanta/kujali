import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';

const OPERATIONS_EXPENSES_ROUTES: Route[] = [
  {
    path: '',
    component: ExpensesPageComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('@app/features/finance/operations/expenses/detail/view').then(m => m.ExpensesViewModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_EXPENSES_ROUTES)],
  exports: [RouterModule]
})
export class OperationsExpensesRouterModule { }
