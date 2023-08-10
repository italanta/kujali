import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ExpenseDetailPageComponent } from './pages/expense-detail-page/expense-detail-page.component';

const EXPENSES_VIEW_ROUTES: Route[] = [

  { path: '', component: ExpenseDetailPageComponent },

  {
    path: 'edit'
    // loadChildren: () => import('').then(),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(EXPENSES_VIEW_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class ExpensesViewRouterModule { }
