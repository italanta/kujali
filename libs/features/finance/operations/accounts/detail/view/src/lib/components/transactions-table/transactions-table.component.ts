import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BankTransaction, FTransaction } from '@app/model/finance/payments';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @Input() dataSource: MatTableDataSource<BankTransaction>;
  @Input() displayedColumns: string[];
  @Input() accountData: {orgId: string, orgAccId: string};

  @Output() allocateTransaction = new EventEmitter();
  @Output() fetchTransactions = new EventEmitter();

  fetchingTransactions: boolean = false;

  constructor(private _aFF: AngularFireFunctions) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  allocateTransactionEvent(row: any) {
    this.allocateTransaction.emit(row);
  }

  updatePontoTrs() {
    this.fetchingTransactions = true;
    this._aFF.httpsCallable('fetchPontoUserBankTransactions')(this.accountData).subscribe(() => {
      this.fetchingTransactions = false;
    })
  }
}
