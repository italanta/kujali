import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import { sortBy as __sortBy } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { Company } from '@app/model/finance/companies';
import { Contact } from '@app/model/finance/contacts';

import { CompaniesService } from '@app/state/finance/companies';
import { ContactsService } from '@app/state/finance/contacts';
// import { OrdersService } from '@app/state/finance/orders';
import { InvoicesService } from '@app/state/finance/invoices';

@Component({
  selector: 'kujali-invoice-customer-details',
  templateUrl: './invoice-customer-details.component.html',
  styleUrls: ['./invoice-customer-details.component.scss']
})
export class InvoiceCustomerDetailsComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() customersForm: FormGroup;
  @Input() newCompanyPassed$: Observable<any>;
  @Output() initCustomerFormEvent = new EventEmitter<any>();

  customerChanged$$ = new BehaviorSubject<any>('');

  contacts$: Observable<Contact[]>;
  companies$: Observable<Company[]>;

  contacts: Contact[];

  companies: Company[];
  filteredCompanies: Company[];

  customerContacts: Contact[];
  filteredCustomerContacts: Contact[];

  isEditMode: boolean;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _router$$: Router,
              private _translateService: TranslateService,
              private _invoiceService: InvoicesService,
              // private _orderService: OrdersService,
              private _companyService: CompaniesService,
              private _contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.lang = this._translateService.initialise();
    const page: string[] = this._router$$.url.split('/');

    this.companies$ = this._companyService.getCompanies();
    this.contacts$ = this._contactsService.getContacts();

    if (page.length > 2 && page[3] == 'new-invoice') {
      this.isEditMode = true;
      this.getInvoiceOrder();

    } else if (page.length > 2 && page[3] === 'edit') {
      this.isEditMode = true;
      this.getActiveInvoice();
    }

    this.getCompanies();
    this.getCustomersList();
    
    this._sbS.sink = this.newCompanyPassed$.subscribe((company) => {
      if (company) {
        this.customerChanged$$.next(company);
      }
    })
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getInvoiceOrder() {
    // this._orderService.getActiveOrder().subscribe((order) => {
    //   if (order) {
    //     if (order.customer) {
    //       this.setCompanyAndContact(order.customer, order.contact);
    //     }
    //   }
    // });
  }

  getActiveInvoice() {
    this._invoiceService.getActiveInvoice().subscribe((invoice) => {
      if (invoice) {
        if (invoice.customer) {
          this.setCompanyAndContact(invoice.customer, invoice.contact);
        }
      }
    });
  }

  setCompanyAndContact(companyId: string, contactId: string) {
    this._sbS.sink = combineLatest([this.companies$, this.contacts$])
      .pipe(take(1))
      .subscribe(([companies, contacts]) => {
        let customer = companies.filter((c) => {
          return c.id == companyId;
        })[0];

        let contact: any = contacts.filter((c) => {
          return c.id == contactId;
        })[0];

        contact = contact ? contact : '';
        this.emitSelectedCustomer(customer, contact);
      });
  }

  emitSelectedCustomer(company: Company, contact?: any) {
    this.customerChanged$$.next(company);
    let customerData = {
      company: company,
      contact: contact,
    };
    this.initCustomerFormEvent.emit(customerData);
  }

  getCustomersList() {
    this._sbS.sink = combineLatest([this.customerChanged$$.asObservable(), this.contacts$])
    .subscribe(([company, contacts]) => {
      if (company && contacts) {
        this.customerContacts = contacts.filter((contact) => {
          return contact.company ? contact.company === company.id : '';
        });
        this.filteredCustomerContacts = this.customerContacts.slice();
      }
    });
  }

  getCompanies() {
    this._sbS.sink = combineLatest([this.companies$, this._contactsService.getContacts()]).subscribe(([companies, contacts]) => {
      if (companies && contacts) {
        let tmpCo : Company[] = [{
          id: 'sasdccslc',
          name: 'New Company',
          hq: 'xcvc',
          phone: 'xcv',
          email: 'xcv',
          accManager: [],
          vatNo: 'xcv',
          facebook: 'xcv',
          linkedin: 'xcv',
        }];

        this.companies = tmpCo
        this.filteredCompanies = this.companies.slice();
  
        this.customerContacts = contacts;
        this.filteredCustomerContacts = this.customerContacts.slice();
      }
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1.id === c2.id;
  }

  contactCompareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1.id === c2.id;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}