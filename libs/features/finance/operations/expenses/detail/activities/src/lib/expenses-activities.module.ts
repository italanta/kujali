import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ActivitiesModule } from '@app/features/activities'

import { ActivitiesTabsComponent } from './components/activities-tabs/activities-tabs.component';
import { CheckPermissionsService } from './services/check-permissions.service';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    
    FormsModule,
    ReactiveFormsModule,

    ActivitiesModule,
  ],
  declarations: [ActivitiesTabsComponent],
  exports: [ActivitiesTabsComponent],
  providers: [CheckPermissionsService]
})
export class ExpensesActivitiesModule {}
