import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SubSink } from 'subsink';

import { round as __round } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Invoice } from '@app/model/finance/invoices';

import { InvoicesService } from '@app/state/finance/invoices';
import { AllocationsStateService } from '@app/state/finance/allocations';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-allocate-transaction-modal',
  templateUrl: './allocate-transaction-modal.component.html',
  styleUrls: ['./allocate-transaction-modal.component.scss'],
})
export class AllocateTransactionModalComponent implements OnInit {

  private _sbS = new SubSink();

  displayedColumns: string[] = ['select', 'number', 'amount', 'date', 'dueDate', 'customer', 'contact', 'status'];

  dataSource = new MatTableDataSource();

  selectedInvoices: Invoice[] = [];

  allocating: boolean = false;

  alloctedAmount: number = 0;

  constructor(private _invoices$$: InvoicesService,
              private _allocationsService: AllocationsStateService,
              @Inject(MAT_DIALOG_DATA) public payment: any
  ) {}

  ngOnInit(): void {
    this._sbS.sink = this._invoices$$.getAllInvoices().subscribe((invoices) => {
      this.dataSource.data = invoices;
    })
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  invoiceSelected(checked: MatCheckboxChange, invoice: Invoice) {
    if (checked.checked) {
      this.selectedInvoices.push(invoice);
    } else {
      let inv = this.selectedInvoices.find((inv) => inv.id == invoice.id);
      this.selectedInvoices.splice(this.selectedInvoices.indexOf(inv!), 1);
    }
    this.calculateAllocatedAmount();
  }

  calculateAllocatedAmount() {
    this.alloctedAmount = this.selectedInvoices.reduce((acc, invoice) => {
      return acc + this.getTotalAmount(invoice.products);
    }, 0);
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

  allocateTransaction() {
    this.allocating = true;
    this._allocationsService.allocatePayment(this.payment, this.selectedInvoices)
                            .subscribe(() => this.allocating = false);
  }

}
