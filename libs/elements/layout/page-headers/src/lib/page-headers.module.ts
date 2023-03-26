import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MatSelectFilterModule } from 'mat-select-filter';

import { SearchHeaderCardComponent } from './components/search-header-card/search-header-card.component';
import { DetailHeaderCardComponent } from './components/detail-header-card/detail-header-card.component';
import { DetailHeaderEditsComponent } from './components/detail-header-edits/detail-header-edits.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MatSelectFilterModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    SearchHeaderCardComponent, DetailHeaderCardComponent, DetailHeaderEditsComponent, ToolbarComponent
  ],
  exports: [
    SearchHeaderCardComponent, DetailHeaderCardComponent, DetailHeaderEditsComponent, ToolbarComponent
  ]
})
export class PageHeadersModule {}
