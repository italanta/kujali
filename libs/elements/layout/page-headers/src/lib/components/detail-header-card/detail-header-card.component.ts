import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { ActiveContactStore } from '@app/state/finance/contacts';
import { ActiveCompanyStore } from '@app/state/finance/companies';
import { ActiveOpportunityStore } from '@app/state/finance/opportunities';
import { ActiveFAccountStore } from '@app/state/finance/banking';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';

@Component({
  selector: 'kujali-finance-detail-header-card',
  templateUrl: './detail-header-card.component.html',
  styleUrls: ['./detail-header-card.component.scss']
})

export class DetailHeaderCardComponent implements OnInit {

  private _sbS = new SubSink();

  _page: string;
  pageName: string
  name: string;

  constructor(private router$$: Router,
              private _location$$: Location,
              private _company$$: ActiveCompanyStore,
              private _ops$$: ActiveOpportunityStore,
              private _contacts$$: ActiveContactStore,
              private _accounts$$: ActiveFAccountStore,
              private _expenses$$: ExpensesStateService,
  ) { }

  ngOnInit(): void {
    this._page = this.router$$.url;

    this.pageName = this._page.split('/')[2];

    if (this.pageName == 'contacts') {
      this._sbS.sink = this._contacts$$.get().subscribe((contact) => { this.name = contact?.fName + ' ' + contact?.lName })
    }
    else if (this.pageName == 'companies') {
      this._sbS.sink = this._company$$.get().subscribe((company) => { this.name = company?.name });
    }
    else if (this.pageName == 'opportunities') {
      this._sbS.sink = this._ops$$.get().subscribe((ops) => { this.name = ops?.title });
    } else if (this.pageName == 'accounts') {
      this._sbS.sink = this._accounts$$.get().subscribe((account) => { this.name = account?.name });
    } else if (this.pageName == 'expenses') {
      this._sbS.sink = this._expenses$$.getActiveExpense().subscribe((exp) => { this.name = exp?.name });
    }
  }

  back(): void {
    this._location$$.back()
  }
}
