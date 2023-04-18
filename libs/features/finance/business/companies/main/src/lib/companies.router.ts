import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';


import { CompanyPageComponent } from './pages/company-page/company-page.component';


const COMPANIES_ROUTES: Route[] = [
  { path: '', component: CompanyPageComponent },

  {
    path: ':id',
    loadChildren: () => import('libs/features/crm/companies/details/view/src/lib/features-crm-companies-details-view.module').then(m => m.FeaturesCrmCompaniesDetailsViewModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(COMPANIES_ROUTES)],
  exports: [RouterModule]
})
export class CompaniesRouterModule { }
