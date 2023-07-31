import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessOpportunitiesDetailGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

import { OpportunitiesPageComponent } from './pages/opportunities-page/opportunities-page.component';

const OPPORTUNITIES_ROUTES: Route[] = [
  { path: '', component: OpportunitiesPageComponent },
  {
    path: ':id',
    loadChildren: () => import('libs/features/finance/business/opportunities/details/view/src/lib/opportunities-view.module').then(m => m.OpportunitiesViewModule),
    canActivate: [IsLoggedInGuard, CanAccessOpportunitiesDetailGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPPORTUNITIES_ROUTES)],
  exports: [RouterModule]
})
export class OpportunitiesRouterModule { }
