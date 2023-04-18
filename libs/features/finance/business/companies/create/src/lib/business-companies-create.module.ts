import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

// import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

// import { KujaliFormFieldsModule } from '@app/elements/crm/controls/form-fields'
// import { ElementsBricksTagsListModule } from '@app/elements/bricks/tags-list'
// import { AccessControlElementsModule } from '@app/elements/access-control';

import { BusinessContactsCreateModule } from '@app/features/finance/business/contacts/create'

import { AddNewCompanyComponent } from './components/add-new-company/add-new-company.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MatDialogModule,
    MatSelectFilterModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,

    BusinessContactsCreateModule,

  ],
  declarations: [
    AddNewCompanyComponent
  ],
  exports: [
    AddNewCompanyComponent
  ]
})
export class CompaniesCreateModule {}
