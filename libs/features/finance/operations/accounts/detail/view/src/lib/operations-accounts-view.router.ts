import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { SingleAccountPageComponent } from './pages/single-account-page/single-account-page.component';

const ACCOUNT_DETAIL_ROUTES: Route[] = [

  {
    path: '',
    component: SingleAccountPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNT_DETAIL_ROUTES)],
  exports: [RouterModule]
})
export class OperationsAccountsViewRouter { }
