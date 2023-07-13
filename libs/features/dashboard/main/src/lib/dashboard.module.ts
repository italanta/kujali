import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';

import { DashboardRouterModule }  from './dashboard-router.module';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { SafePipe } from './pages/safe.pipe';

/**
 * Auth module. Contains the auth of the app and Base Access Control.
 */
@NgModule({
  imports: [CommonModule, RouterModule, MultiLangModule,
            MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
            FormsModule, ReactiveFormsModule,
            UserStateModule,

            iTalPageModule,

            DashboardRouterModule],

  declarations: [
    DashboardPageComponent,
    SafePipe
  ]
})
export class DashboardModule { }
