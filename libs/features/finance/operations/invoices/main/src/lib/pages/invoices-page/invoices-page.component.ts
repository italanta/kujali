import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { round as __round } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';
import { __DateFromStorage } from '@iote/time';

import { Invoice } from '@app/model/finance/invoices';
// import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService } from '@app/state/finance/opportunities';
// import { _CheckPermission } from '@app/state/access-control';

import { KujaliUsersService } from '@app/state/user';

import { InvoicesService } from '@app/state/finance/invoices';

const DATA: Invoice[] = []

@Component({
  selector: 'kujali-invoices-page',
  templateUrl: './invoices-page.component.html',
  styleUrls: ['./invoices-page.component.scss']
})
export class InvoicesPageComponent implements OnInit {

  private _sbS = new SubSink();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['number', 'amount', 'date', 'dueDate', 'customer', 'contact', 'status'];

  dataSource = new MatTableDataSource(DATA);

  filter$$ = new BehaviorSubject<(Invoice) => boolean>((c) => true);
  filter$: Observable<{ invoices: Invoice[]}>

  showFilter: boolean;

  allTableData = this.dataSource.data;

  lang: 'fr' | 'en' | 'nl';

  // readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;
  
  constructor(private _translateService: TranslateService,
              private _snackBar: MatSnackBar,
              private cdref: ChangeDetectorRef,
              private _oppsService: OpportunitiesService,
              private _kuUserService: KujaliUsersService,
              private _invoicesService: InvoicesService,
              private _router$$: Router
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const sortState: Sort = { active: 'title', direction: 'asc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

    this.cdref.detectChanges();
  }

  getTotalAmount(products: any) {
    let totals: any = products.map((order) => {        
      const total =
      order.cost * order.qty - (order.cost * order.qty * order.discount) / 100;
      return {
        totalSum: total,
        vat: total * (order.vat / 100),
      };
    });

    var totalResult = totals.reduce(function (order: any, value: any) {
      return order + value.totalSum + value.vat;
    }, 0);

    return __round(totalResult, 2);
  }

  getInvoices() {
    this._sbS.sink = combineLatest([this.filter$$.asObservable(), this._invoicesService.getAllInvoices()])
    .subscribe(([filter, invoices]) => {
      const filterRecords = invoices.filter(filter);
      this.dataSource.data = filterRecords;
      this.allTableData = this.dataSource.data
    });
  }

  getUserName(userId: string) {
    let user: any = this._kuUserService.getOrgUser(userId);
    return user?.displayName;
  }

  getDate(date: any) {
    return __DateFromStorage(date).format('DD/MM/YYYY');
  }

  getCompanyNames(companyId: string): string {
    return this._oppsService.getCompanyNames(companyId);
  }

  getContactNames(contactId: string): string {
    return this._oppsService.getContactNames(contactId);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fieldsFilter(value: (Invoice) => boolean) {    
    this.filter$$.next(value);
  }

  toogleFilter(value) {
    this.showFilter = value
  }

  
  viewInvoice(invoiceId: string) {
    this._router$$.navigate(['operations', 'invoices', invoiceId, 'edit']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  createInvoice () {
    this._router$$.navigate(['operations/invoices/create']);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
