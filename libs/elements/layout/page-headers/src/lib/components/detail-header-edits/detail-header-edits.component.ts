import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { Contact } from '@app/model/finance/contacts';
import { ActiveContactStore } from '@app/state/finance/contacts';
import { ActiveCompanyStore } from '@app/state/finance/companies';
import { ActiveOpportunityStore } from '@app/state/finance/opportunities';

@Component({
  selector: 'volk-finance-detail-header-edits',
  templateUrl: './detail-header-edits.component.html',
  styleUrls: ['./detail-header-edits.component.scss'],
})
export class DetailHeaderEditsComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  @Input() editPageName: string;

  @Output() updateContactEvent = new EventEmitter<any>();

  contact$: Observable<Contact>;

  _page: string;
  _name: string;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _contacts$$: ActiveContactStore,
              private _company$$: ActiveCompanyStore,
              private _opps$$: ActiveOpportunityStore,
              private _router$$: Router,
              private location: Location,
              private _trl: TranslateService
  ) {}

  ngOnInit(): void {
    this.lang = this._trl.initialise();
    this._page = this._router$$.url.split('/')[1];
    this.getHeaderData();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._trl.setLang(lang);
  }

  getHeaderData() {
    if (this._page == 'contacts') {
      this._sbS.sink = this._contacts$$.get().subscribe((contact) => {
        this._name = contact?.fName + ' ' + contact?.lName;
      });
    } else if (this._page == 'companies') {
      this._sbS.sink = this._company$$.get().subscribe((company) => {
        this._name = company?.name;
      });
    } else if (this._page == 'opportunities') {
      this._sbS.sink = this._opps$$.get().subscribe((opps) => {
        this._name = opps?.title;
      });
    }
  }

  translateText(text: string): string {
    return this._trl.translate(text);
  }

  toogleUpdate() {
    this.updateContactEvent.emit();
  }

  mainPageRoute() {
    this._router$$.navigate([this._page]);
  }

  back = () => this.location.back();

  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }

}
