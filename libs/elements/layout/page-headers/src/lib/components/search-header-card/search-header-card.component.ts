import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

// import { AppClaimDomains } from '@app/model/access-control';

@Component({
  selector: 'kujali-finance-search-header-card',
  templateUrl: './search-header-card.component.html',
  styleUrls: ['./search-header-card.component.scss']
})
export class SearchHeaderCardComponent implements OnDestroy {

  private _sbS = new SubSink();

  // readonly CAN_CREATE_DOMAIN_DATA = AppClaimDomains.CanAddMembers;

  page: string = '';

  @Input() tableData;
  @Output() searchTableEvent = new EventEmitter<any>();
  @Output() toogleFilterEvent = new EventEmitter();

  showFilter: boolean;

  constructor(private _router$$: Router) { }

  ngOnInit() {
    const elements = this._router$$.url.split('/');
    this.page = elements.length >= 0 ? elements[elements.length - 1] : '__noop__';
    this.setPageName(this.page);
  }

  setPageName(page: string) {
    switch (page) {
      case 'invoices':
        this.page = 'INVOICES.HEADER.INVOICES';
        break;
      default:
        break;
    }
  }

  toogleFilter() {
    this.showFilter = !this.showFilter
    this.toogleFilterEvent.emit(this.showFilter);
  }

  searchTable = (value) => { this.searchTableEvent.emit(value) };

  ngOnDestroy = () => this._sbS.unsubscribe();
}
