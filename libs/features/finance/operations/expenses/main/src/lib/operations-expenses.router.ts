import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';

const OPERATIONS_EXPENSES_ROUTES: Route[] = [
  {
    path: '',
    component: ExpensesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_EXPENSES_ROUTES)],
  exports: [RouterModule]
})
export class OperationsExpensesRouterModule { }
