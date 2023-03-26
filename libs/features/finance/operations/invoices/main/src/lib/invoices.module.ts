import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule} from '@angular/cdk/drag-drop';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MatSelectFilterModule } from 'mat-select-filter';

import { iTalPageModule } from '@app/elements/layout/page';
// import { AccessControlElementsModule } from '@app/elements/access-control';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { InvoicesFilterComponent } from './components/invoices-filter/invoices-filter.component';
import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';

import { InvoicesRouterModule } from './invoices-main.router';

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
    DragDropModule,

    PageHeadersModule,
    iTalPageModule,

    // AccessControlElementsModule,
    
    InvoicesRouterModule
  ],
  declarations: [
    InvoicesPageComponent,
    InvoicesFilterComponent
  ],
})
export class InvoicesModule {}
