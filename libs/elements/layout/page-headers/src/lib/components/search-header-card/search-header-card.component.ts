import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { TranslateService } from '@ngfire/multi-lang';

import { AppClaimDomains } from '@app/model/access-control';

import { AddNewCompanyComponent } from '@app/features/crm/companies/create';
import { AddNewContactFormComponent } from '@app/features/crm/contacts/create';
import { AddNewOpportunityComponent } from '@app/features/crm/opportunities/create';

@Component({
  selector: 'volk-crm-search-header-card',
  templateUrl: './search-header-card.component.html',
  styleUrls: ['./search-header-card.component.scss']
})
export class SearchHeaderCardComponent implements OnDestroy {

  private _sbS = new SubSink();

  readonly CAN_CREATE_DOMAIN_DATA = AppClaimDomains.CanAddMembers;

  page: string = '';

  @Input() tableData;
  @Output() searchTableEvent = new EventEmitter<any>();
  @Output() toogleFilterEvent = new EventEmitter();

  showFilter: boolean;

  constructor(public dialog: MatDialog,
              private _router$$: Router,
              private _trl: TranslateService
  ) { }

  ngOnInit() {
    const elements = this._router$$.url.split('/');
    const mypage = elements.length >= 0 ? elements[elements.length - 1] : '__noop__';
    this.page = mypage 
  }


  openAddNewDialog() {

    if (this.page == 'companies' || this.page == 'Bedrijven'){

      // this._sbS.sink = this.dialog.open(AddNewCompanyComponent, {panelClass: 'full-width-dialog'})
      // .afterClosed().subscribe();

    }
    else if (this.page == 'contacts' || this.page == 'contacts') {

      this._sbS.sink = this.dialog.open(AddNewContactFormComponent, {panelClass: 'full-width-dialog'})
      .afterClosed().subscribe();
    }
    else if (this.page == 'opportunities' || this.page == 'opportunities') {
      this._sbS.sink = this.dialog.open(AddNewOpportunityComponent, {panelClass: 'full-width-dialog'})
      .afterClosed().subscribe();
    }
    else if (this.page == 'invoices') {
      this._router$$.navigate(['invoices/create']);
    }
    else if (this.page == 'quotes') {
      // this._router$$.navigate(['quotes/create']);
    }
    else if (this.page == 'orders') {
      // this._router$$.navigate(['orders/create']);
    }
    else if (this.page == 'invoices' || this.page == 'invoices') {
      this._router$$.navigate(['invoices/create']);
    }

  }

  toogleFilter() {
    this.showFilter = !this.showFilter
    this.toogleFilterEvent.emit(this.showFilter);
  }

  searchTable(value)
  {
    this.searchTableEvent.emit(value)
  }

  ngOnDestroy = () => this._sbS.unsubscribe();

}
