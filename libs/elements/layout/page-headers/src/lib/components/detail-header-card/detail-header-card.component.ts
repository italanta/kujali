import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { ActiveContactStore } from '@app/state/crm/contacts';

import { ActiveCompanyStore } from '@app/state/crm/companies';
import { ActiveOpportunityStore } from '@app/state/crm/opportunities';

@Component({
  selector: 'volk-crm-detail-header-card',
  templateUrl: './detail-header-card.component.html',
  styleUrls: ['./detail-header-card.component.scss']
})

export class DetailHeaderCardComponent implements OnInit {

  private _sbS = new SubSink();

  _page: string;
  pageName: string
  name: string;

  constructor(
    private _contacts$$: ActiveContactStore,
    private _company$$: ActiveCompanyStore,
    private _ops$$: ActiveOpportunityStore,
    private _location: Location,
    private route: Router
  ) 
  {
    this._page = this.route.url

    this.pageName = this._page.split('/')[1]

    if (this.pageName == 'contacts') {
      this._sbS.sink = this._contacts$$.get().subscribe((contact) => {this.name = contact?.fName + ' ' + contact?.lName})
    }
    else if (this.pageName == 'companies') {
      this._sbS.sink = this._company$$.get().subscribe((company) => { this.name = company?.name});
    }
    else if (this.pageName == 'opportunities') {
      this._sbS.sink = this._ops$$.get().subscribe((ops) => { this.name = ops?.title});
    }
  }

  ngOnInit(): void {

  }

  back(): void {
    this._location.back()
  }

}
