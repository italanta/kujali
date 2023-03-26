import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { reduce as __reduce, sortBy as __sortBy } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { Organisation } from '@app/model/organisation';
import { Company } from '@app/model/finance/companies';

import { OrganisationService } from '@app/state/organisation';

@Component({
  selector: 'kujali-invoice-company-details',
  templateUrl: './invoice-company-details.component.html',
  styleUrls: ['./invoice-company-details.component.scss']
})
export class InvoiceCompanyDetailsComponent implements OnInit {
  private _sbS = new SubSink();

  @Output() initCompanyFormEvent = new EventEmitter<Organisation>();
  @Input() companyForm: FormGroup;

  company : Organisation;

  companies : Company[];
  filteredCompanies: Company[];

  lang: 'fr' | 'en' | 'nl';

  constructor(private _activeOrg$$: OrganisationService,
              private _translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.lang = this._translateService.initialise();
    this.getActiveOrg();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getActiveOrg() {
    this._activeOrg$$.getActiveOrg().subscribe((data) => {
      if (data) {
        this.initCompanyFormEvent.emit(data);
      }
    })
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
