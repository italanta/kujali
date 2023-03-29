import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { filter, map, Observable, tap } from 'rxjs';

import { FTransaction } from '@app/model/finance/payments';
import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStateService } from '@app/state/finance/banking';
import { AllocateTransactionModalComponent } from '@app/features/finance/banking/allocations';

@Component({
  selector: 'app-single-account-page',
  templateUrl: './single-account-page.component.html',
  styleUrls: ['./single-account-page.component.scss'],
})
export class SingleAccountPageComponent implements OnInit {
  private _sbS = new SubSink();

  displayedColumns: string[] = ['bankIcon', 'fromAccName', 'toAccName', 'amount', 'source', 'mode', 'trStatus', 'actions'];

  dataSource = new MatTableDataSource<FTransaction>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  activeAccount$ : Observable<FAccount>;
  activeAccountTrs$ : Observable<FTransaction>;

  accountId: string;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _accountsService: AccountsStateService
  ) {}

  ngOnInit(): void {

    this.accountId = this._router$$.url.split('/')[4];

    this.activeAccount$ = this._accountsService.getActiveFAccount();
    this._sbS.sink = this._accountsService.getAllAccountsTransactions()
                              .pipe(
                                map(trs => this.applyFilter(trs)),
                                tap(trs => this.dataSource.data = trs)
                              ).subscribe();
  }

  applyFilter(trs: any) {
    return trs.filter(tr => tr.from === this.accountId);
  }

  allocateTransaction(tr: any) {
    this._dialog.open(AllocateTransactionModalComponent, {
      minWidth: '800px',
      data: tr
    });
  }
}
