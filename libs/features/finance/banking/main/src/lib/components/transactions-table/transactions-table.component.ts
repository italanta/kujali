import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { FTransaction } from '@app/model/finance/payments';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent {

  @Input() dataSource: MatTableDataSource<FTransaction>;
  @Input() displayedColumns: string[];

  @Output() allocateTransaction = new EventEmitter();

  constructor() { }

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
}
