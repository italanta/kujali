import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { ContactsPageComponent } from './pages/contacts-page.component';

// import { FeaturesFinanceContactsDetailsViewModule } from '@app/features/finance/contacts/details/view'

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

// import { AccessControlElementsModule } from '@app/elements/access-control';

import { ContactsFilterComponent } from './components/contacts-filter/contacts-filter.component';

import { ContactsRouterModule } from './contacts.router';

@NgModule({
  imports: [
    CommonModule,

    RouterModule, 
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    MatSelectFilterModule,

    iTalPageModule,
    PageHeadersModule,

    ContactsRouterModule
  ],
  declarations: [
    ContactsPageComponent, 
    ContactsFilterComponent
  ],

  exports: [ContactsPageComponent]
})
export class BusinessContactModule {}
