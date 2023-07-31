import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule} from '@angular/cdk/drag-drop';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MatSelectFilterModule } from 'mat-select-filter';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { AccessControlModule } from '@app/elements/access-control';

import { InvoicesDetailViewPageComponent } from './pages/invoices-detail-view-page/invoices-detail-view-page.component';

import { InvoicesSidebarComponent } from './components/invoices-sidebar/invoices-sidebar.component';
import { InvoicesHeaderComponent } from './components/invoices-header/invoices-header.component';
import { InvoicesProductsComponent } from './components/invoices-products/invoices-products.component';
import { InvoicesFormComponent } from './components/invoices-form/invoices-form.component';
import { InvoiceCustomerDetailsComponent } from './components/invoice-customer-details/invoice-customer-details.component';
import { InvoiceCompanyDetailsComponent } from './components/invoice-company-details/invoice-company-details.component';

import { InvoiceFormsService } from './services/invoice-forms.service';
import { InvoiceModelService } from './services/invoice-model.service';

import { InvoicesViewRouterModule } from './invoices-view.router';
import { FormFieldsModule } from '@app/elements/forms/form-fields';

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

    AccessControlModule,
    iTalPageModule,
    PageHeadersModule,
    FormFieldsModule,
    InvoicesViewRouterModule
  ],
  declarations: [
    InvoicesDetailViewPageComponent,
    InvoicesSidebarComponent,
    InvoicesHeaderComponent,
    InvoicesProductsComponent,
    InvoicesFormComponent,
    InvoiceCustomerDetailsComponent,
    InvoiceCompanyDetailsComponent
  ],
  providers: [
    InvoiceFormsService,
    InvoiceModelService
  ]
})
export class InvoicesViewModule {}
