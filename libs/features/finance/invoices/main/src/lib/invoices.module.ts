import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule} from '@angular/cdk/drag-drop';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MatSelectFilterModule } from 'mat-select-filter';

import { ElementsLayoutPagesModule } from '@volk/elements/layout/pages';
// import { AccessControlElementsModule } from '@volk/elements/access-control';
import { ElementsLayoutHeaderPagesModule } from '@volk/elements/layout/page-header';

import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';

import { InvoicesRouterModule } from './invoices-main.router';
import { InvoicesFilterComponent } from './components/invoices-filter/invoices-filter.component';

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

    ElementsLayoutHeaderPagesModule,
    ElementsLayoutPagesModule,

    AccessControlElementsModule,
    
    InvoicesRouterModule
  ],
  declarations: [
    InvoicesPageComponent,
    InvoicesFilterComponent
  ],
})
export class InvoicesModule {}
