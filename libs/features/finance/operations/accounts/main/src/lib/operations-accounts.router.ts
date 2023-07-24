import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';

const ACCOUNTS_ROUTES: Route[] = [
  {
    path: '',
    component: AccountsPageComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('@app/features/finance/operations/accounts/detail/view').then(m => m.OperationsAccountsViewModule),
  },
  {
    path: 'connect-ponto',
    loadChildren: () => import('@app/features/finance/banking/activate-banking').then(m => m.ActivateBankingModule),
    canActivate: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNTS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsAccountsRouterModule { }
