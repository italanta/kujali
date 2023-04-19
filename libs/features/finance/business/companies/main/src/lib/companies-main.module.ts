import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { UserStateModule } from '@app/state/user';

import { iTalPageModule } from '@app/elements/layout/page';

import { PageHeadersModule } from '@app/elements/layout/page-headers';
// import { AccessControlElementsModule } from '@kujali/elements/access-control';

import { CompanyFilterComponent } from './components/company-filter/company-filter.component';
import { CompanyPageComponent } from './pages/company-page/company-page.component';

import { CompaniesRouterModule } from './companies.router';


@NgModule({
  imports: [
    CommonModule,

    RouterModule, 
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    MaterialFormBricksModule,
    FormsModule, ReactiveFormsModule,
    MatSelectFilterModule,
    UserStateModule,

    iTalPageModule,
    PageHeadersModule,

    CompaniesRouterModule
  ],
  declarations: [
    CompanyPageComponent,
    CompanyFilterComponent
  ],
  exports: [CompanyPageComponent]
})
export class BusinessCompaniesModule {}
