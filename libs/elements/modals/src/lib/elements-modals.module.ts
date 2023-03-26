import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';


@NgModule({
  imports: [
    CommonModule,

    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,

    MultiLangModule
  ],
  declarations: [
    DeleteModalComponent
  ],
  exports: [
    DeleteModalComponent
  ]})
export class ElementsModalsModule {}
