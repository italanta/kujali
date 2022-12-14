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
  },

  {
    path: 'home',
    loadChildren: () => import('@app/features/dashboard/main').then(m => m.DashboardModule),
    canActivate: [IsLoggedInGuard]
  },

  {
    path: 'budgets',
    loadChildren: () => import('@app/features/budgetting/budgets').then(m => m.FinancialPlanningModule),
    canActivate: [IsLoggedInGuard]
  },

  {
    path: 'operations',
    loadChildren: () => import('@app/features/operations/budgets').then(m => m.OperationsBudgetsModule),
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
