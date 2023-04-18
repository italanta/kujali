import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { round as __round } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Invoice } from '@app/model/finance/invoices';
// import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService } from '@app/state/finance/opportunities';
// import { _CheckPermission } from '@app/state/access-control';

import { KujaliUsersService } from '@app/state/user';

import { CALCULATE_INVOICE_TOTAL, InvoicesService } from '@app/state/finance/invoices';
import { AllocationsStateService } from '@app/state/finance/allocations';

import { COMBINE_INVOICE_AND_INVOICE_ALLLOCS } from '../../providers/invoice-allocs-util.function';

@Component({
  selector: 'kujali-invoices-page',
  templateUrl: './invoices-page.component.html',
  styleUrls: ['./invoices-page.component.scss']
})
export class InvoicesPageComponent implements OnInit {

  private _sbS = new SubSink();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['number', 'amount', 'date', 'dueDate', 'customer', 'contact', 'status', 'actions'];

  dataSource = new MatTableDataSource();

  filter$$ = new BehaviorSubject<(Invoice) => boolean>((c) => true);
  filter$: Observable<{ invoices: Invoice[]}>

  showFilter: boolean;

  allTableData = this.dataSource.data;

  lang: 'fr' | 'en' | 'nl';

  // readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;
  
  constructor(private _router$$: Router,
              private _snackBar: MatSnackBar,
              private cdref: ChangeDetectorRef,
              private _oppsService: OpportunitiesService,
              private _kuUserService: KujaliUsersService,
              private _invoicesService: InvoicesService,
              private _invoiceAllocsService: AllocationsStateService
  ) {}

  ngOnInit(): void {
    this.getInvoices();
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

  getInvoices() {
    this._sbS.sink = combineLatest([this.filter$$.asObservable(), this._invoicesService.getAllInvoices(),
                                    this._invoiceAllocsService.getInvoicesAllocations()])
    .subscribe(([filter, invoices, invoiceAllocs]) => {
      const filterRecords = invoices.filter(filter);
      this.dataSource.data = COMBINE_INVOICE_AND_INVOICE_ALLLOCS(filterRecords, invoiceAllocs);
      this.allTableData = this.dataSource.data
    });
  }

  getTotalAmount = (invoice: Invoice) => CALCULATE_INVOICE_TOTAL(invoice);

  getUserName(userId: string) {
    return this._kuUserService.getOrgUser(userId)?.displayName;
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
    this._router$$.navigate(['business', 'invoices', invoiceId, 'edit']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  createInvoice () {
    this._router$$.navigate(['business/invoices/create']);
  }

  allocateTransactionEvent(inv: Invoice) {

  }

  ngOnDestroy = () => {this._sbS.unsubscribe()}
}
