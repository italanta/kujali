import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { UserStateModule } from '@app/state/user';

import { iTalPageModule } from '@app/elements/layout/page';

import { BusinessRouterModule } from './business.router';

@NgModule({
  imports: [
    CommonModule,

    RouterModule, 
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    UserStateModule,

    iTalPageModule,

    BusinessRouterModule
  ],
})
export class FinanceBusinessModule {}
