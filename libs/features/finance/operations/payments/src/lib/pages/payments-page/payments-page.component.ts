import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';
import { combineLatest, map, Observable, tap, filter } from 'rxjs';

import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';
import { BankTransaction } from '@app/model/finance/payments';
import { PaymentAllocation } from '@app/model/finance/allocations';

import { PaymentsStateService } from '@app/state/finance/payments';
import { AllocationsStateService } from '@app/state/finance/allocations';
import { AllocateTransactionModalComponent } from '@app/features/finance/banking/allocations';
import { CreateManualPaymentsModalComponent } from '../../modals/create-manual-payments-modal/create-manual-payments-modal.component';

@Component({
  selector: 'app-payments-page',
  templateUrl: './payments-page.component.html',
  styleUrls: ['./payments-page.component.scss'],
})
export class PaymentsPageComponent implements OnInit, AfterViewInit {

  private _sbS = new SubSink();

  displayedColumns: string[] = ['bankIcon', 'fromAccName', 'toAccName', 'amount', 'source', 'actions'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  startPontoOnboarding = false;

  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts$: Observable<FAccount[]>;

  showFilter: boolean = false;

  constructor(private _dialog: MatDialog,
              private _aFF: AngularFireFunctions,
              private _paymentsService: PaymentsStateService,
              private _allocsService: AllocationsStateService
  ) { }

  ngOnInit(): void {
    this._sbS.sink = combineLatest([this._paymentsService.getAllPayments(),
    this._allocsService.getPaymentAllocations()])
      .pipe(
        filter(([trs, pAllocs]) => !!trs && !!pAllocs),
        map(([trs, pAllocs]) => this.flatMapTransactionsAndPayments(trs, pAllocs)),
        tap((data) => { this.dataSource.data = data }))
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fieldsFilter(value: (Payment) => boolean) {    
    // this.filter$$.next(value);
  }

  toogleFilter(value) {
    this.showFilter = value
  }

  flatMapTransactionsAndPayments(trs: BankTransaction[], pAllocs: PaymentAllocation[]) {
    let trsAndPayments = trs.map((tr) => {
      let paymentAlloc = pAllocs.find((p) => p.id === tr.id);
      return { ...tr, ...paymentAlloc }
    })
    return trsAndPayments;
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  allocateTransactionEvent(row: any) {
    this._dialog.open(AllocateTransactionModalComponent, {
      minWidth: '700px',
      data: row
    });
  }

  createPayment() {
    this._dialog.open(CreateManualPaymentsModalComponent, {minWidth: '600px'});
  }

  getPaymentSource(source: number) {
    switch (source) {
      case 1:
        return 'Swan';
      case 2:
        return 'Ponto';
      case 3:
        return 'Bank';
      case 4:
        return 'Mpesa';
      case 5:
        return 'Cash';
      default:
        return '';
    }
  }

  updatePontoTrs() { }
}
