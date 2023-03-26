import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';

import * as moment from 'moment';

import { Organisation } from '@app/model/organisation';
import { Company } from '@app/model/finance/companies';
import { Contact } from '@app/model/finance/contacts';

import { CompaniesStore } from '@app/state/finance/companies';
import { ContactsStore } from '@app/state/finance/contacts';
// import { PermissionsStateService } from '@app/state/organisation';
import { InvoicesService } from '@app/state/finance/invoices';

import { InvoiceModel } from '../model/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormsService {
  private _sbS = new SubSink();

  private _state: InvoiceModel | null;
  companies$: Observable<Company[]>;
  contacts$: Observable<Contact[]>;

  constructor(private _fb: FormBuilder,
              private _companies$$: CompaniesStore,
              private _contacts$$: ContactsStore,
              private _invoiceService: InvoicesService,
              // private _permissionsService: PermissionsStateService
  )
  { }

  initModalState(_page: string): InvoiceModel {
    if (!this._state) {
      const model = new InvoiceModel(this._fb, _page, this._companies$$, this._contacts$$, this._invoiceService, this);
      this._state = model;
    }

    return this._state as InvoiceModel;
  }

  getModalState(): InvoiceModel {
    if (!this._state) throw new Error('[InvoiceModel] State not initialised.');

    return this._state as InvoiceModel;
  }

  getFormDate(invoiceDate: any) : any {
    if (invoiceDate){
      const date: any = invoiceDate.seconds;
      const formatted = moment(date * 1000);
      return formatted;
    }else {
      return '';
    }
  }

  newProduct(): FormGroup {
    return this._fb.group({
      desc: [''],
      cost: [0],
      qty: [0],
      vat: [0],
      discount: new FormArray([])
    })
  }

  _initMainForm(invoiceDetails: any, isEditMode:boolean): FormGroup {
    return this._fb.group({
      id: invoiceDetails.id ?? '',
      title: invoiceDetails.title ?? '',
      number: invoiceDetails.number ?? '',
      date: isEditMode == true ? this.getFormDate(invoiceDetails.date) : moment() ?? '',
      dueDate: isEditMode == true ? this.getFormDate(invoiceDetails.dueDate) : moment().add(30, 'days') ?? '',
      status: invoiceDetails.status,
      products: new FormArray([]),
      structuredMessage: invoiceDetails.structuredMessage ?? '',
      currency: invoiceDetails.currency ?? 'EUR'
    });
  }

  _initCompanyForm(company: Organisation): FormGroup {
    return this._fb.group({
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      address: company.address ?? '',
      // vatNo: company.vatNo ?? '',
      // email: company.email ?? '',
      // phone: company.phone ?? '',
      // bankAccounts: [company.bankAccounts] ?? []
    });
  }

  _initCustomerForm(customerData: any): FormGroup {
    let customer = customerData.company;
    let contact = customerData.contact;

    return this._fb.group({
      id: customer.id,
      name: customer,
      logo: customer.logoImgUrl,
      contact: [contact?.id ?? ''],
      address: [{value: customer.hq ?? '', disabled: true}],
      vat: [{value: customer.vatNo ?? '', disabled: true}],
      email: [{value: customer.email ?? '', disabled: true}],
      phone: [{value: customer.phone ?? '', disabled: true}],
    });
  }

  _initProducts(item: any): FormGroup {
    return this._fb.group({
      desc: item.desc,
      cost: item.cost,
      qty: item.qty,
      vat: item.vat,
      discount: item.discount.length > 0
        ? new FormArray([new FormControl(item.discount[0])])
        : new FormArray([])
    })
  }

  endModelState()
  {
    this._state = null;
  }}
