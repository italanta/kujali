import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

const BANKING_ROUTES: Route[] = [];

@NgModule({
  imports: [RouterModule.forChild(BANKING_ROUTES)],
  exports: [RouterModule]
})
export class BankingRouterModule { }
