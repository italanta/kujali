import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import * as moment from 'moment';
import { intersection as ___intersection, map as ___map, flatMap } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { Invoice } from '@app/model/finance/invoices';
import { Company } from '@app/model/finance/companies';
import { Contact } from '@app/model/finance/contacts';

import { KuUser } from '@app/model/common/user';

import { InvoicesService } from '@app/state/finance/invoices';

import { KuUsersService } from '@app/state/user';

import { InvoicesFilter, __NullInvoicesFilter } from './invoices-filter.interface';

@Component({
  selector: 'volk-invoices-filter',
  templateUrl: './invoices-filter.component.html',
  styleUrls: ['./invoices-filter.component.scss']
})
export class InvoicesFilterComponent implements OnInit {
  private _sbS = new SubSink();

  @Output() filterChanged = new EventEmitter<(Invoices: Invoice) => boolean>();

  filter: InvoicesFilter = __NullInvoicesFilter();

  invoicesFilterFormGroup: FormGroup;
  filterForm: FormGroup;

  companiesList: Company[];
  filteredCompaniesList: Company[];
  customersList: any[];
  filteredCustomersList: any[];
  contactsList: Contact[];
  filteredContactsList: Contact[];

  createdByList: KuUser[];
  filteredCreatedByList: KuUser[];

  statusList: string[];
  filteredStatusList: any;

  filterCount: number = 0;

  lang: 'fr' | 'en' | 'nl';

  sortby = 'year';


  constructor(private _translateService: TranslateService,
              private _fb: FormBuilder,
              private _invoicesService: InvoicesService,
              private _KuUserService: KuUsersService
  ) { }

  ngOnInit(): void {
    this.buildInvoicesSearchForm();

    this.getInvoices();
    this.getFilterFormValues();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  buildInvoicesSearchForm() {
    this.invoicesFilterFormGroup = this._fb.group({
      assingToControl : [''],
      dateControl: [''],
      customerControl : [''],
      contactControl : [''],
      statusControl : [''],
      searchControl : ['']
    })
  }

  getInvoices() {
    this._sbS.sink = this._invoicesService.getCompanyAndContacts().subscribe(
      ([invoices, customers, contacts]) => {
        let contactIds = invoices.map((Invoice) => Invoice.contact!);
        this.contactsList = contacts.filter(contact => contactIds.includes(contact.id!));
        this.filteredContactsList = this.contactsList.slice();

        let customerIds = invoices.map((Invoice) => Invoice.customer!);
        this.customersList = customers.filter(company => customerIds.includes(company.id!));
        this.filteredCustomersList = this.customersList.slice();

        let assignedUsers = this.flattenArray(invoices, 'createdBy');
        assignedUsers = Array.from(assignedUsers.values());
        this.createdByList = this._KuUserService.getOrgUsersProperties(assignedUsers);
        this.filteredCreatedByList = this.createdByList.slice();

        this.statusList = this.flattenArray(invoices, 'status');
        this.statusList = Array.from(this.statusList.values());
        this.filteredStatusList = this.statusList.slice();
      }
    )
  }

  getFilterFormValues() {
    this._sbS.sink = this.invoicesFilterFormGroup.valueChanges.subscribe((values) => {
      this._rfc(values);
    })
  }

  /** rfc - Resolve filter change */
  private _rfc(form?: any) {
    const model: InvoicesFilter = {
      allowedAssigned: form.assingToControl ?? [],
      allowedCompanies: form.customerControl ?? [],
      allowedContacts: form.contactControl ?? [],
      allowedDeadline: form.dateControl ?? '',
      allowedStatus: form.statusControl ?? [],
      search: form.searchControl ?? '',

      isFiltered: false,
    }

    model.isFiltered = model.allowedCompanies.length > 0 || model.search.length > 0;

    this.filter = model;

    this.filterCount = model.allowedAssigned.length +
      model.allowedCompanies.length + model.allowedContacts.length + model.allowedStatus.length 
      + (model.allowedDeadline ? 1 : 0)
    this.filterChanged.emit((c: Invoice) => this._companyAppliesToFilter(c));
  }

  /** Filter is an AND filter across the different selected filter categories. 
   *    If one of the filters fails, the whole filter must fail. */
  private _companyAppliesToFilter(c: Invoice): boolean {
    const f = this.filter;

    if (f.allowedAssigned.length > 0 && !f.allowedAssigned.find(fc => fc === c.createdBy))
      return false;
    if (f.allowedCompanies.length > 0 && !f.allowedCompanies.find(fc => fc === c.customer))
      return false;
    if (f.allowedContacts.length > 0 && !f.allowedContacts.find(fc => fc === c.contact))
      return false;
    if (f.allowedStatus.length > 0 && !f.allowedStatus.find(fc => fc === c.status))
      return false;
    if (f.allowedDeadline == 'past' && !(moment(this.getMomentdate(c.dueDate)).isBefore(moment())))
      return false;
    if ((f.allowedDeadline != 'past' && f.allowedDeadline != '') && !((moment(this.getMomentdate(c.dueDate)).isSame(new Date(), f.allowedDeadline))))
      return false;
    if (f.search
      && !(`${c.title}_${c.status}_`.toLowerCase()
        .indexOf(f.search.toLowerCase()) >= 0))
      return false;

    // If it made it through all the filters, we are good and the object is allowed :) :)
    // If we cannot prove the object is not a good record, it MUST be a good record.
    return true;
  }

  getMomentdate = (value: any) => { return value.seconds * 1000 }

  flattenArray = (Invoice: Invoice[], fieldName: string): any => { return new Set(flatMap(Invoice, fieldName)) }

  clearFIlters() {
    console.log('clicked');
    
    this.invoicesFilterFormGroup.patchValue({
      assingToControl : '',
      dateControl: '',
      customerControl : '',
      contactControl : '',
      statusControl : '',
      searchControl : ''
    });
    this.filterChanged.emit((c: Invoice) => this._companyAppliesToFilter(c));
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}
