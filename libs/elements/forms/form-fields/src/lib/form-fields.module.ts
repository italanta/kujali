import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

// import { ElementsBricksTagsListModule } from '@volk/elements/bricks/tags-list';

import { TagsFormFieldComponent } from './components/tags-form-field/tags-form-field.component';
import { PhoneFormFieldComponent } from './components/phone-form-field/phone-form-field.component';
import { RolesFormFieldComponent } from './components/roles-form-field/roles-form-field.component';
import { SocialMediaFieldComponent } from './components/social-media-field/social-media-field.component'
import { AddRoleFieldComponent } from './components/add-role-field/add-role-field.component';
import { OrgUsersFormField } from './components/org-users/org-users.component'

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MatInputModule,
    MatFormFieldModule,
    MatSelectFilterModule,

    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,

    FormsModule,
    ReactiveFormsModule,

    // ElementsBricksTagsListModule,
  ],
  declarations: [
    TagsFormFieldComponent,
    PhoneFormFieldComponent,
    RolesFormFieldComponent,
    SocialMediaFieldComponent,
    AddRoleFieldComponent,
    OrgUsersFormField
  ],
  exports: [
    TagsFormFieldComponent,
    PhoneFormFieldComponent,
    RolesFormFieldComponent,
    SocialMediaFieldComponent,
    AddRoleFieldComponent,
    OrgUsersFormField
  ]
})
export class FormFieldsModule { }
