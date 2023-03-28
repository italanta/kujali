import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InvoicesService } from '@app/state/finance/invoices';
import { __DateFromStorage } from '@iote/time';

import { round as __round } from 'lodash';
import { SubSink } from 'subsink';

const DATA: any[] = [];

@Component({
  selector: 'app-allocate-transaction-modal',
  templateUrl: './allocate-transaction-modal.component.html',
  styleUrls: ['./allocate-transaction-modal.component.scss'],
})
export class AllocateTransactionModalComponent implements OnInit {

  private _sbS = new SubSink();

  displayedColumns: string[] = ['number', 'amount', 'date', 'dueDate', 'customer', 'contact', 'status'];

  dataSource = new MatTableDataSource(DATA);

  constructor(private _invoices$$: InvoicesService,
              @Inject(MAT_DIALOG_DATA) public payment: any) {}

  ngOnInit(): void {
      this._sbS.sink = this._invoices$$.getAllInvoices().subscribe((invoices) => {
        this.dataSource.data = invoices;
      })
  }

  viewInvoice(invoiceId: string) {
    console.log(invoiceId);
  }

  getDate(date: any) {
    return __DateFromStorage(date).format('DD/MM/YYYY');
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

}
