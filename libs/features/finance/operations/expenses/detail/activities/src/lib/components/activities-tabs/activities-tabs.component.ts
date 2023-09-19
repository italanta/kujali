import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { CheckPermissionsService } from '../../services/check-permissions.service';

@Component({
  selector: 'app-activities-tabs',
  templateUrl: './activities-tabs.component.html',
  styleUrls: ['./activities-tabs.component.scss'],
})
export class ActivitiesTabsComponent {
  private _sbS = new SubSink();

  lang: 'fr' | 'en' | 'nl';
  oppsLen: string;
  quotesLen: string;
  ordersLen: string;
  invoicesLen: string;

  canViewActions$: Observable<boolean>;
  canViewOpps: Observable<boolean>;
  canViewInvoices: Observable<boolean>;
  canViewContacts: Observable<boolean>;

  constructor(private _translateService: TranslateService,
              private _ps: CheckPermissionsService
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.canViewActions$ = this._ps.checkActionsPermissions();
    this.canViewOpps = this._ps.checkOppsPermissions();
    this.canViewInvoices = this._ps.checkInvoicesPermissions();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getOppsLen(value: any){
    this.oppsLen = 'opportunities ' + `(${value})`;
  }

  getQuotesLen(value: string) {
    this.quotesLen = 'quotes ' + `(${value})`;
  }
  
  getOrdersLen(value: string) {
    this.ordersLen = 'orders ' + `(${value})`;
  }

  getInvoicesLen(value: string) {
    this.invoicesLen = 'invoices ' + `(${value})`;
  }
}
