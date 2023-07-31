import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessBudgetsDetailGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

import { SelectBudgetPageComponent } from './pages/select-budget/select-budget.component';

const BUDGET_EXPL_ROUTES: Route[] = [
  {
    path: '',
    component: SelectBudgetPageComponent
  },
  {
    path: ':id/edit',
    loadChildren: () => import('libs/features/budgetting/budget-explorer/src/lib/budget-explorer.module').then(m => m.BudgetExplorerFeatureModule),
    canActivate: [IsLoggedInGuard, CanAccessBudgetsDetailGuard]
  },
  {
    path: ':id/view',
    loadChildren: () => import('libs/features/budgetting/budget-explorer/src/lib/budget-explorer.module').then(m => m.BudgetExplorerFeatureModule),
    canActivate: [IsLoggedInGuard, CanAccessBudgetsDetailGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(BUDGET_EXPL_ROUTES)],
  exports: [RouterModule]
})
export class BudgetRouter { }
