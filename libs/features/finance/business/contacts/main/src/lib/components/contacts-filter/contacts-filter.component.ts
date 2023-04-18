import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { intersection as ___intersection, map as ___map, flatMap, differenceBy as __differenceBy} from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { Tags } from '@app/model/tags';
import { Company } from '@app/model/finance/companies';
import { Role } from '@app/model/roles';
import { Contact } from '@app/model/finance/contacts';

import { ContactsStore } from '@app/state/finance/contacts';
import { CompaniesStore } from '@app/state/finance/companies';

import { ContactsFilter, __NullContactsFilter } from './contacts-filter.interface';

@Component({
  selector: 'app-contacts-filter',
  templateUrl: './contacts-filter.component.html',
  styleUrls: ['./contacts-filter.component.scss']
})

export class ContactsFilterComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  @Output() filterChanged = new EventEmitter<(Contact) => boolean>();

  filter: ContactsFilter = __NullContactsFilter();

  companies$: Observable<Company[]>;
  roles$: Observable<Role[]>;
  tags$: Observable<Tags[]>;

  companyControl = new FormControl();
  searchControl = new FormControl();
  rolesControl = new FormControl();
  tagsControl = new FormControl();

  companies: any[];
  role: any[];
  tags: any[];
  searchText: any;

  companyNames: string[];
  companiesList: Company[];
  filteredCompaniesList: Company[];
  rolesList: string[];
  filteredRolesList: string[];
  tagsList: string[];
  filteredTagsList: string[];

  filterCount: number = 0;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _translateService : TranslateService,
              private _contacts$$: ContactsStore,
              private _companies$$: CompaniesStore
  ) 
  {
    this.lang = this._translateService.initialise();
  }


  ngOnInit(): void {
    this.getFilterData();

    this._sbS.sink = this.getValueChanges(this.companyControl).subscribe(cs => { this.companies = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.rolesControl).subscribe(cs => { this.role = cs; this._rfc() });
    this._sbS.sink = this.getValueChanges(this.tagsControl).subscribe(cs => { this.tags = cs; this._rfc() });
    this._sbS.sink = this.searchControl.valueChanges.subscribe(cs => { this.searchText = cs; this._rfc() });;
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getFilterData() {
    this._sbS.sink = combineLatest([this._contacts$$.get(), this._companies$$.get()]).subscribe(([contacts, companies]) => {
      this.companyNames = contacts.map((company) => company.company!)

      this.companiesList = companies.filter(company => this.companyNames.includes(company.id!))
      this.filteredCompaniesList = this.companiesList.slice();
            
      this.rolesList = this.flattenArray(contacts, 'role');  
      this.rolesList = Array.from(this.rolesList.values());
      this.filteredRolesList = this.rolesList;

      this.tagsList = this.flattenArray(contacts, 'tags');
      this.tagsList = Array.from(this.tagsList.values());
      this.filteredTagsList = this.tagsList;
    })
  }

  /** rfc - Resolve filter change */
  private _rfc() {
    const model: ContactsFilter = {
      allowedCompanies: this.companies ?? [],
      allowedRoles: this.role ?? [],
      allowedTags: this.tags ?? [],
      search: this.searchText ?? '',

      isFiltered: false,
    }

    model.isFiltered = model.allowedCompanies.length > 0 || model.allowedRoles.length > 0 ||
      model.allowedTags.length > 0 || model.search.length > 0;

    this.filter = model;
    this.filterCount = model.allowedCompanies.length + model.allowedRoles.length + model.allowedTags.length
    this.filterChanged.emit((c: Contact) => this._contactAppliesToFilter(c));
  }

  /** Filter is an AND filter across the different selected filter categories. 
   *    If one of the filters fails, the whole filter must fail. */
  private _contactAppliesToFilter(c: Contact): boolean {
    const f = this.filter;

    if (f.allowedCompanies.length > 0 && !f.allowedCompanies.find(fc => fc === c.company))
      return false;
    if (f.allowedRoles.length > 0 && !(___intersection(f.allowedRoles, c.role).length > 0))
      return false;
    if (f.allowedTags.length > 0 && !(___intersection(f.allowedTags, c.tags).length > 0))
      return false;
    if (f.search
      && !(`${c.address}_${c.dob}_${c.email}_${c.fName}_${c.lName}_${c.phone}_${c.mainLanguage ?? ''}`.toLowerCase()
        .indexOf(f.search.toLowerCase()) >= 0))
      return false;

    // If it made it through all the filters, we are good and the object is allowed :) :)
    // If we cannot prove the object is not a good record, it MUST be a good record.
    return true;
  }

  flattenArray = (contact: Contact[], fieldName: string): any => { return new Set(flatMap(contact, fieldName)) }

  getValueChanges(formControl: FormControl) {
    return formControl.valueChanges.
      pipe(map(v => { return [...v] }));
  }

  clearFIlters() { 
    this.companyControl.patchValue([])
    this.searchControl.patchValue('')
    this.rolesControl.patchValue([])      
    this.tagsControl.patchValue([])   

    this.companies = this.tags = this.role = [];
    this.searchText = '';
    
    this._rfc()
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}
