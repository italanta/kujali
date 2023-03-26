import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';


import { OperationsPageComponent } from './pages/operations-page/operations-page.component';

import { OperationsRouterModule } from './operations.router';


@NgModule({
  imports: [
    CommonModule,

    RouterModule, 
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    UserStateModule,

    iTalPageModule,
    OperationsRouterModule
  ],
  declarations: [OperationsPageComponent],
  providers: []
})
export class OperationsModule {}
