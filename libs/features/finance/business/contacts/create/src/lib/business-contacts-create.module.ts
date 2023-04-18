import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
import { Ng2TelInputModule } from 'ng2-tel-input';

import { AddNewContactComponent } from '..';

// import { CrmFormFieldsModule } from '@volk/elements/crm/controls/form-fields';
import { AddNewContactFormComponent } from './components/add-new-contact-form/add-new-contact-form.component'

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule, 
    MaterialBricksModule, 
    FlexLayoutModule,
    Ng2TelInputModule,

    MatSelectFilterModule,

    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,

    // CrmFormFieldsModule,
    MatFormFieldModule, MatInputModule
  ],
  declarations: [
    AddNewContactComponent,
    AddNewContactFormComponent
  ],
  exports: [
    AddNewContactComponent, 
    MatFormFieldModule, 
    MatInputModule,
    AddNewContactFormComponent
  ]
})
export class BusinessContactsCreateModule {}