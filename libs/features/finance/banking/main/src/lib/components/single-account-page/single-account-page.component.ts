import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';
import { combineLatest, filter, map, Observable, tap } from 'rxjs';

import { BankTransaction, FTransaction } from '@app/model/finance/payments';
import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStateService } from '@app/state/finance/banking';
import { PaymentsStateService } from '@app/state/finance/payments';

import { AllocationsStateService } from '@app/state/finance/allocations';

import { AllocateTransactionModalComponent } from '@app/features/finance/banking/allocations';
import { PaymentAllocation } from '@app/model/finance/allocations';

@Component({
  selector: 'app-single-account-page',
  templateUrl: './single-account-page.component.html',
  styleUrls: ['./single-account-page.component.scss'],
})
export class SingleAccountPageComponent implements OnInit {
  private _sbS = new SubSink();

  displayedColumns: string[] = ['bankIcon', 'fromAccName', 'toAccName', 'amount', 'source', 'mode', 'trStatus', 'allocStatus', 'actions'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  activeAccount$ : Observable<FAccount>;
  activeAccount: FAccount;
  activeAccountTrs$ : Observable<FTransaction>;

  accountId: string;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _aFF: AngularFireFunctions,
              private _accountsService: AccountsStateService,
              private _paymentsService: PaymentsStateService,
              private _allocsService: AllocationsStateService
  ) {}

  ngOnInit(): void {

    this.accountId = this._router$$.url.split('/')[4];

    this.activeAccount$ = this._accountsService.getActiveFAccount();
    this._sbS.sink = combineLatest([this.activeAccount$, this._paymentsService.getAccountPayments(),
                                    this._allocsService.getPaymentAllocations()])
                              .pipe(
                                filter(([acc, trs, pAllocs]) => !!acc && !!trs && !!pAllocs),
                                tap(([acc, trs, pAllocs]) => {this.activeAccount = acc}),
                                map(([acc, trs, pAllocs]) => this.flatMapTransactionsAndPayments(trs, pAllocs)),
                                tap((data) => {this.dataSource.data = data}))
                              .subscribe();
  }

  flatMapTransactionsAndPayments(trs: BankTransaction[], pAllocs: PaymentAllocation[]) {
    let trsAndPayments = trs.map((tr) => {
      let paymentAlloc = pAllocs.find((p) => p.id === tr.id);
      return {...tr, ...paymentAlloc}
    })
    return trsAndPayments;
  }

  allocateTransaction(tr: any) {
    this._dialog.open(AllocateTransactionModalComponent, {
      minWidth: '800px',
      data: tr
    });
  }

  fetchTransactions() {
    let fetchData = {
      orgId: this.activeAccount.createdBy,
      orgAccId: this.accountId
    }

    this._aFF.httpsCallable('fetchPontoUserBankTransactions')(fetchData).subscribe(() => {
      console.log('Ponto Transactions Fetched');
    })
  }
}
