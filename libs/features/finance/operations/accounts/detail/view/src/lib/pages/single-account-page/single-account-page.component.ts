import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';
import { combineLatest, filter, from, map, Observable, tap } from 'rxjs';

import { BankTransaction, FTransaction } from '@app/model/finance/payments';
import { PaymentAllocation } from '@app/model/finance/allocations';
import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStateService } from '@app/state/finance/banking';
import { PaymentsStateService } from '@app/state/finance/payments';
import { OrganisationService } from '@app/state/organisation';
import { AllocationsStateService } from '@app/state/finance/allocations';

import { AllocateTransactionModalComponent } from '@app/features/finance/banking/allocations';

import { getIpAddressObservable$$ } from '../../providers/get-customer-ip-address.provider';

@Component({
  selector: 'app-single-account-page',
  templateUrl: './single-account-page.component.html',
  styleUrls: ['./single-account-page.component.scss'],
})
export class SingleAccountPageComponent implements OnInit {
  private _sbS = new SubSink();

  displayedColumns: string[] = ['bankIcon', 'fromAccName', 'toAccName', 'amount', 'source', 'actions'];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  activeAccount$ : Observable<FAccount>;
  activeAccount: FAccount;
  activeAccountTrs$ : Observable<FTransaction>;

  accountId: string;
  accountData: {orgId: string, orgAccId: string, customerIp: string};

  allAccountDataIsReady: boolean = false;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _org$$: OrganisationService,
              private _aFF: AngularFireFunctions,
              private _accountsService: AccountsStateService,
              private _paymentsService: PaymentsStateService,
              private _allocsService: AllocationsStateService
  ) {}

  ngOnInit() {    

    this.accountId = this._router$$.url.split('/')[3];

    const customerIp$ = getIpAddressObservable$$;

    this.activeAccount$ = this._accountsService.getActiveFAccount();
    this._sbS.sink = combineLatest([customerIp$, this._org$$.getActiveOrg(), this.activeAccount$,
                                    this._paymentsService.getAccountPayments(),
                                    this._allocsService.getPaymentAllocations()])
                              .pipe(
                                filter(([ip, org, acc, trs, pAllocs]) => !!ip && !!org && !!acc && !!trs && !!pAllocs),
                                tap(([ip, org, acc, trs, pAllocs]) => {
                                  this.activeAccount = acc;
                                  this.accountData = {orgId: org.id!, orgAccId: this.accountId, customerIp: ip as string};
                                }),
                                map(([ip, org, acc, trs, pAllocs]) => this.flatMapTransactionsAndPayments(trs, pAllocs)),
                                tap((data) => {this.dataSource.data = data}),
                                tap((data) => this.allAccountDataIsReady = true))
                              .subscribe();
  }

  flatMapTransactionsAndPayments(trs: BankTransaction[], pAllocs: PaymentAllocation[]) {
    let trsAndPayments = trs.map((tr) => {
      let paymentAlloc = pAllocs.find((p) => p.id === tr.id);
      return {...tr, ...paymentAlloc}
    });
    return trsAndPayments;
  }

  allocateTransaction(tr: any) {
    this._dialog.open(AllocateTransactionModalComponent, {
      minWidth: '800px',
      data: tr
    });
  }
}
