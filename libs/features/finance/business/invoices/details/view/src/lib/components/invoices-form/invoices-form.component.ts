import { AfterContentChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { Subject } from 'rxjs';

import * as ogm from 'belgian-vcs-ogm';
import { ToastService } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Invoice } from '@app/model/finance/invoices';

import { InvoicesService } from '@app/state/finance/invoices';

import { InvoiceModel } from '../../model/invoice.model';
import { InvoiceFormsService } from '../../services/invoice-forms.service';
import { InvoiceModelService } from '../../services/invoice-model.service';

@Component({
  selector: 'kujali-invoices-form',
  templateUrl: './invoices-form.component.html',
  styleUrls: ['./invoices-form.component.scss']
})
export class InvoicesFormComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {

  private _sbS = new SubSink();
  
  _page: string[];
  public model: InvoiceModel;

  activeCurrency$: Subject<string> = new Subject<string>();
  newCompanyPassed$: Subject<any> = new Subject();
  activeInvoice: Invoice;

  currency: string;
  invoiceNumber: string;

  isEditMode: boolean;
  printInvoice: boolean;
  invoiceHasExpDate: boolean;
  newInvoiceFromOrder: boolean;
  showStructuredMessage: boolean = false;

  activeCompanyOrContact: any;
  canEditInvoice: boolean = false;

  invoiceIsReady: boolean = false;

  constructor(private _router$$: Router,
              private _toastService: ToastService,
              private _invoiceService: InvoicesService,
              private _invoiceFormService: InvoiceFormsService,
              private _invoiceModelService: InvoiceModelService,
  ) 
  {
    this.activeCompanyOrContact = this._router$$.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    this._page = this._router$$.url.split('/');

    this.model = this._invoiceFormService.initModalState();
    
    if (this._page.length > 2 && this._page[2] === 'invoices' && this._page[4] === 'edit') {
      this.isEditMode = true;
      this.model.getActiveInvoice().subscribe(() => {this.invoiceIsReady = true});
    } else {
      this.model.addNewProduct();
      this.invoiceIsReady = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.activeCompanyOrContact && this.activeCompanyOrContact.page == 'companies' && this._page[2] == 'create') {
      this.newCustomerSelectedEvent({
        company: this.activeCompanyOrContact.data,
        contact: ''
      });
      this.newCompanyPassed$.next(this.activeCompanyOrContact.data);
    } else if (this.activeCompanyOrContact && this.activeCompanyOrContact.page == 'contacts' && this._page[2] == 'create') {
      this.newCustomerSelectedEvent({
        company: this.activeCompanyOrContact.data.company ?? '',
        contact: this.activeCompanyOrContact.data.contact ?? ''
      });
      this.newCompanyPassed$.next(this.activeCompanyOrContact.data.company);
    }
  }

  ngAfterContentChecked(): void {
    this.activeInvoice = this.model.activeInvoice;
    this.invoiceNumber = this.model.activeInvoice?.number;
    this.canEditInvoice = this.model.canEditInvoice;

    if (this.activeInvoice?.structuredMessage) {
      this.showStructuredMessage = true ;
    }
  }

  showFormPreview() {
    let pdfData = {
      customer: this.model.customerFormGroup.value,
      company: this.model.companyFormGroup.value,
      invoice: this.model.mainInvoiceFormGroup.value,
      currency: this.currency,
      printInvoice: this.printInvoice,
      invoiceNumber: this.invoiceNumber
    }
    this._invoiceModelService.showFormPreview(pdfData);
    this.printInvoice = false;
  }

  newCompanySelectedEvent(company: Organisation) {
    this.model.companyFormGroup =
      this._invoiceFormService._initCompanyForm(company);
    this.model.companyFormGroup.disable();
  }

  newCustomerSelectedEvent(customer: any) {
    this.model.customerFormGroup =
      this._invoiceFormService._initCustomerForm(customer);

      if (this.canEditInvoice == false) {
        this.model.customerFormGroup.disable()
      }
  }

  downloadInvoice() {
    this.printInvoice = true;
    this.showFormPreview();
  }

  selectedCurrency(currency: string) {
    this.currency = currency;
    this.model.mainInvoiceFormGroup.patchValue({currency: currency});
    this.activeCurrency$.next(currency);    
  }

  showStructuredMessageFn(showMessage: boolean) {    
    this.showStructuredMessage = showMessage;
    if (showMessage) {
      const structuredMessage = ogm.generateRandomOGM(); 
      this.model.mainInvoiceFormGroup.patchValue({structuredMessage: structuredMessage});
    }
  }

  saveInvoice() {
    if (this.isEditMode) {
      this.updateInvoice(this.model.mainInvoiceFormGroup, this.model.companyFormGroup, this.model.customerFormGroup);
    } else {
      this.createInvoice(this.model.mainInvoiceFormGroup, this.model.companyFormGroup, this.model.customerFormGroup);
    }
  }

  createInvoice(invoice: FormGroup, company: FormGroup, customer: FormGroup) {
    if (this.model.customerFormGroup.valid) {
      this._invoiceService.createInvoice(invoice, company, customer);
    } else {
      this._toastService.doSimpleToast("Please select a customer for this invoice", 2000);
    }
  }

  updateInvoice(invoice: FormGroup, company: FormGroup, customer: FormGroup) {
    this._invoiceService.updateInvoice(invoice, company, customer, this.activeInvoice.id!);
  }

  copyInvoice() {
    this._invoiceService.copyInvoice(this.model.mainInvoiceFormGroup, this.model.companyFormGroup, this.model.customerFormGroup);
  }

  deleteInvoice() {
    this._invoiceService.deleteInvoice(this.activeInvoice);
  }

  sendInvoice() {
    this._invoiceService.sendInvoice(this.model.mainInvoiceFormGroup, this.model.companyFormGroup, this.model.customerFormGroup, this.invoiceNumber);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
    this._invoiceFormService.endModelState();
    this.showStructuredMessage = false;
    this.model.mainInvoiceFormGroup.reset()
    this.model.customerFormGroup.reset();
    this.model.productsArray.clear();
  }
}