import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules }    from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

export const APP_ROUTES: Route[] = [

  // App Entry-Point - For now, we mock the normally to include paths such as org and flow selection and go
  //    straight too the default active flow.
  { path: '', redirectTo: `home`, pathMatch: 'full' },

  //
  // AUTH

  {
    path: 'auth',
    loadChildren: () => import('@app/features/auth/login').then(m => m.AuthModule),
    data: { title: 'Authentication' }
  },

  {
    path: 'orgs',
    loadChildren: () => import('libs/features/organisation/main/src/lib/organisation.module').then(m => m.OrganisationModule),
    data: { title: 'Organisation' }
  },

  {
    path: 'home',
    loadChildren: () => import('@app/features/dashboard/main').then(m => m.DashboardModule),
    data: { title: 'Dashboard' },
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'business',
    loadChildren: () => import('@app/features/finance/business/main').then(m => m.FinanceBusinessModule),
    data: { title: 'Business' },
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'operations',
    loadChildren: () => import('@app/features/finance/operations/main').then(m => m.OperationsModule),
    data: { title: 'Operations' },
    canActivate: [IsLoggedInGuard]
  },

  {
    path: 'budgets',
    loadChildren: () => import('@app/features/budgetting/budgets').then(m => m.FinancialPlanningModule),
    data: { title: 'Budgets' },
    canActivate: [IsLoggedInGuard]
  },

  {
    path: 'settings',
    loadChildren: () => import('@app/features/settings/main').then(m => m.SettingsModule),
    data: { title: 'Settings' },
    canActivate: [IsLoggedInGuard]
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      APP_ROUTES,
      {
        enableTracing: true,
        // useHash: true,
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
