import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { intersection as ___intersection, flatMap as __flatMap} from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { Tags } from '@app/model/tags';
import { Company } from '@app/model/finance/companies';

import { TagsStore } from '@app/state/tags';
import { CompaniesStore } from '@app/state/finance/companies';

import { CompanyFilter, __NullCompanyFilter } from './company-filter.interface';

@Component({
  selector: 'kujali-company-filter',
  templateUrl: './company-filter.component.html',
  styleUrls: ['./company-filter.component.scss']
})

export class CompanyFilterComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  @Output() filterChanged = new EventEmitter<(Compamy) => boolean>();

  filter: CompanyFilter = __NullCompanyFilter();

  companies$: Observable<Company[]>;
  tags$: Observable<Tags[]>;

  companyControl = new FormControl();
  hqControl = new FormControl();
  tagsControl = new FormControl();
  search = new FormControl();

  companies: any[];
  hq: any[];
  tags: any[];
  searchText: any;

  companyManagers: any;
  filteredcompanyManagers: string[];
  companyNames: string[];
  filteredcompanyNames: string[];
  tagsList: string[];
  filteredTagsList: string[];

  filterCount: number = 0;
  lang: 'fr' | 'en' | 'nl';
  
  constructor(private _translateService: TranslateService,
              private _companies$$: CompaniesStore,
              private _tags$$: TagsStore
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.getFilterData();

    this._sbS.sink = this.getValueChanges(this.companyControl).subscribe(cs => { this.companies = cs; this._rfc()});
    this._sbS.sink = this.getValueChanges(this.hqControl).subscribe(cs => { this.hq = cs; this._rfc()});
    this._sbS.sink = this.getValueChanges(this.tagsControl).subscribe(cs => { this.tags = cs; this._rfc()});
    this._sbS.sink = this.search.valueChanges.subscribe(cs => { this.searchText = cs; this._rfc()});
  }

  getFilterData () {
    this.tags$ = this._tags$$.get()

    this._sbS.sink = this._companies$$.get().subscribe(
      (companies) => {
        this.companyNames = companies.map((companies) => companies.name);
        this.filteredcompanyNames = this.companyNames.slice();

        this.companyManagers = this.flattenArray(companies, 'accManager');
        this.companyManagers = Array.from(this.companyManagers.values());
        this.filteredcompanyManagers = this.companyManagers.slice();

        this.tagsList = this.flattenArray(companies, 'tags');
        this.tagsList = Array.from(this.tagsList.values());
        this.filteredTagsList = this.tagsList.slice();
      }
    )
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  /** rfc - Resolve filter change */
  private _rfc() {
    const model: CompanyFilter = {
      allowedCompanies: this.companies ?? [],
      allowedHqs: this.hq ?? [],
      allowedTags: this.tags ?? [],
      search: this.searchText ?? '',

      isFiltered: false,
    }

    model.isFiltered = model.allowedCompanies.length > 0 || model.allowedHqs.length > 0 ||
      model.allowedTags.length > 0 || model.search.length > 0;

    this.filter = model;    
    this.filterCount = model.allowedCompanies.length + model.allowedHqs.length + model.allowedTags.length
    this.filterChanged.emit((c: Company) => this._companyAppliesToFilter(c));    
  }

  /** Filter is an AND filter across the different selected filter categories. 
   *    If one of the filters fails, the whole filter must fail. */
  private _companyAppliesToFilter(c: Company): boolean {
    const f = this.filter;

    if (f.allowedCompanies.length > 0 && !f.allowedCompanies.find(fc => fc === c.name))
      return false;
    if (f.allowedHqs.length > 0 && !(___intersection(f.allowedHqs, c.accManager).length > 0))
      return false;
    if (f.allowedTags.length > 0 && !(___intersection(f.allowedTags, c.tags).length > 0))
      return false;
    if (f.search
      && !(`${c.name}_${c.accManager}_${c.tags}_${c.hq}_${c.phone}_${c.vatNo}`.toLowerCase()
        .indexOf(f.search.toLowerCase()) >= 0))
      return false;

    // If it made it through all the filters, we are good and the object is allowed :) :)
    // If we cannot prove the object is not a good record, it MUST be a good record.
    return true;
  }

  flattenArray = (company: Company[], fieldName: string): any => { return new Set(__flatMap(company, fieldName)) }

  getValueChanges(formControl: FormControl) {
    return formControl.valueChanges.
      pipe(map(v => { return [...v] }));
  }

  clearFIlters() { 
    this.companyControl.patchValue([])   
    this.tagsControl.patchValue([])   
    this.hqControl.patchValue([])   
    this.search.patchValue('')

    this.companies = this.hq = this.tags = [];
    this.searchText = '';
    
    this._rfc()
  }
  
  ngOnDestroy = () => this._sbS.unsubscribe();
}
