import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';
import { OperationsBudgetsPageComponent } from './pages/operations-budgets-page/operations-budgets-page.component';


const OPERATIONS_BUDGETS_ROUTES: Route[] = [
  {
    path: '',
    component: OperationsBudgetsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_BUDGETS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsBudgetsRouterModule { }
