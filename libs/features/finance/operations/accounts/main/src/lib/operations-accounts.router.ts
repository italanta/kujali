import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessAccountsDetailGuard, CanAccessAccountsGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';

const ACCOUNTS_ROUTES: Route[] = [
  {
    path: '',
    component: AccountsPageComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('@app/features/finance/operations/accounts/detail/view').then(m => m.OperationsAccountsViewModule),
    canActivate: [IsLoggedInGuard, CanAccessAccountsDetailGuard]
  },
  {
    path: 'connect-ponto',
    loadChildren: () => import('@app/features/finance/banking/activate-banking').then(m => m.ActivateBankingModule),
    canActivate: [IsLoggedInGuard, CanAccessAccountsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNTS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsAccountsRouterModule { }
