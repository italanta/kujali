import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { Moment } from 'moment';

import { __DateFromStorage, __DateToStorage } from '@iote/time';
import { ToastService } from '@iote/bricks-angular';

import { Invoice, InvoicesPrefix } from '@app/model/finance/invoices';

import { OrganisationService } from '@app/state/organisation';
import { ContactsStore } from '@app/state/finance/contacts';
import { CompaniesStore } from '@app/state/finance/companies';

import { DeleteModalComponent } from '@app/elements/modals';

import { InvoicesStore } from '../stores/invoices.store';
import { ActiveInvoiceStore } from '../stores/active-invoice.store';
import { InvoicesPrefixStore } from '../stores/invoice-prefix.store';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private _sbS = new SubSink();

  totalInvoices: number;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _toastService: ToastService,
              private _bs: AngularFireFunctions,
              private _invoices$$: InvoicesStore,
              private _invoicesPrefix$$: InvoicesPrefixStore,
              private _activeInvoice$$: ActiveInvoiceStore,
              private _orgService: OrganisationService,
              private _contacts$$: ContactsStore,
              private _companies$$: CompaniesStore
  ) 
  {
    this.getInvoiceTotal();
  }

  getInvoiceTotal() {
    this._invoices$$.get().pipe(tap((d) => {this.totalInvoices = d.length})).subscribe();
  }

  dateToStorage(date: Moment) {
    if (date) {
      return __DateToStorage(date);
    }
    return '';
  }

  getAllInvoices(): Observable<Invoice[]> {
    return this._invoices$$.get();
  }

  getActiveInvoice(): Observable<Invoice> {
    return this._activeInvoice$$.get();
  }

  getCompanyAndContacts() {
    return combineLatest([this._invoices$$.get(), this._companies$$.get(), this._contacts$$.get()]);
  }

  prepareInvoice(invoice: FormGroup, company: FormGroup, customer: FormGroup) {
    let invoiceValue = {...invoice.value};

    console.log(invoiceValue);
    
    let invoiceData : Invoice = {
      title: invoiceValue.title,
      customer: customer.value.id,
      company: company.value.id,
      contact: customer.value.contact,
      number: invoiceValue.number ?? '',
      products: invoiceValue.products,
      date: this.dateToStorage(invoiceValue.date),
      dueDate: this.dateToStorage(invoiceValue.dueDate),
      currency: invoiceValue.currency ?? 'EUR',
      structuredMessage: invoiceValue.structuredMessage,
      status: invoiceValue.status,
    }

    invoiceData.products.forEach((product: any) => {
      if (typeof product.desc !== 'string') {
        const desc = product.desc;
        product.desc = typeof desc === 'string' ? desc : desc?.name;
      }
    })

    return invoiceData;
  }

  createInvoice(invoice: FormGroup, company: FormGroup, customer: FormGroup) {
    let invoiceData = this.prepareInvoice(invoice, company, customer);
    this.saveInvoice(invoiceData);
  }

  copyInvoice(invoice: FormGroup, company: FormGroup, customer: FormGroup) {
    let invoiceData = this.prepareInvoice(invoice, company, customer);
    invoiceData.title = invoiceData.title + '-' + 'copy';
    this.saveInvoice(invoiceData);
  }

  saveInvoice(invoiceData: Invoice) {
    this._invoicesPrefix$$.get().pipe(take(1)).subscribe((pr) => {
      if (pr) {
        invoiceData.number = `${pr.prefix}${Number(pr.number)}`
        this._invoices$$.add(invoiceData as Invoice).subscribe((invoice) => {
          if (invoice) {
            this._router$$.navigate(['invoices', invoice.id, 'edit']);
          }
        })
        pr.number = pr.number + 1;
        this._invoicesPrefix$$.set(pr as InvoicesPrefix);
      }
    })
  }

  updateInvoice(invoice: FormGroup, company: FormGroup, customer: FormGroup, activeInvoiceId: string) {
    let invoiceData = this.prepareInvoice(invoice, company, customer);
    invoiceData.id = activeInvoiceId;
    console.log(invoiceData);
    
    this._invoices$$.update(invoiceData as Invoice).subscribe((success) => {}); 
  }

  deleteInvoice(activeInvoice: Invoice) {
    let deleteDialogRef = this._dialog.open(DeleteModalComponent, {
      data: 'Invoice',
      minWidth: 'fit-content'
    })

    deleteDialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption?.event == 'delete') {
        this._invoices$$.remove(activeInvoice).subscribe((success) => {
          this._router$$.navigate(['invoices']);
        })
      }
    })
  }

  sendInvoice(invoiceForm: FormGroup, company: FormGroup, customer: FormGroup, invoiceNumber) {
    invoiceForm.value.date = this.getTimestampDate(invoiceForm.value.date);
    invoiceForm.value.dueDate = this.getTimestampDate(invoiceForm.value.dueDate);

    this._sbS.sink = combineLatest([this._orgService.getActiveOrg(), this._invoicesPrefix$$.get()])
    .pipe(take(1)).subscribe(([org, prefix]) => {
      let data = {
        to: customer.getRawValue().email,
        companyData: company.value,
        customerData: customer.getRawValue(),
        invoice: invoiceForm.value,
        invoiceNumber: invoiceNumber,
        orgId: org.id,
        extraNote: prefix.extraNote,
        message: {
          subject: `Invoice From ${company.value.name}`,
          html: `Please find attached a copy of your invoice. <br> Kind Regards, <br> ${company.value.name}`,
          attachments: [{filename: 'termsandconditions.pdf', path: prefix.termsAndConditionsDocUrl}]
        }
      }
      this._bs.httpsCallable('sendInvoiceEmail')(data).subscribe((success) => {
        this._toastService.doSimpleToast('Email sent successfully', 2000);
      });
    })
  }

  getTimestampDate(date: any) {
    if (date) {
      let newDate = __DateToStorage(date);
      return __DateFromStorage(newDate).format('DD/MM/YYYY');
    }
    return '-'
  }
}