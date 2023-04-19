import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AddNewContactComponent } from '..';

import { FormFieldsModule } from '@app/elements/forms/form-fields';

import { AddNewContactFormComponent } from './components/add-new-contact-form/add-new-contact-form.component'

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule, 
    MaterialBricksModule, 
    FlexLayoutModule,

    MatSelectFilterModule,

    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatChipsModule,

    FormFieldsModule,
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
