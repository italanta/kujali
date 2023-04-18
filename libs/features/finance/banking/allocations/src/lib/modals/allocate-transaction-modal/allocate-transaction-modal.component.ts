import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { SubSink } from 'subsink';

import { combineLatest, map, tap } from 'rxjs';
import { round as __round } from 'lodash';
import { Timestamp } from '@firebase/firestore-types';

import { __DateFromStorage } from '@iote/time';

import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';

import { CALCULATE_INVOICE_TOTAL, InvoicesService } from '@app/state/finance/invoices';
import { AllocationsStateService } from '@app/state/finance/allocations';
import { BankTransaction, Payment } from '@app/model/finance/payments';
import { PaymentAllocation } from '@app/model/finance/allocations';

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

  constructor(private _dialog: MatDialog,
              private _invoices$$: InvoicesService,
              private _allocationsService: AllocationsStateService,
              @Inject(MAT_DIALOG_DATA) public payment: any
  ) {}

  ngOnInit(): void {
    const invoiceAllocs$ = this._allocationsService.getInvoicesAllocations();

    this._sbS.sink = combineLatest([invoiceAllocs$, this._invoices$$.getAllInvoices()])
                                  .pipe(
                                    map(([invAllocs, invoices]) => this.flatMapTransactionsAndPayments(invoices, invAllocs)),
                                    map((data) => data.filter((inv) => inv.allocStatus !== 1)),
                                    tap((data) => {this.dataSource.data = data}))
                                  .subscribe();
  }

  flatMapTransactionsAndPayments(invoices: Invoice[], invAllocs: InvoiceAllocation[]) {
    let invAndAllocs = invoices.map((inv) => {
      let invAlloc = invAllocs.find((invA) => invA.id === inv.id);
      return {...inv, ...invAlloc}
    })
    return invAndAllocs;
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
      return acc + this.getTotalAmount(invoice);
    }, 0);
  }

  viewInvoice(invoiceId: string) {
    console.log(invoiceId);
  }

  getDate(date: Timestamp) {
    return __DateFromStorage(date).format('DD/MM/YYYY');
  }

  getTotalAmount(invoice: Invoice) {
    return __round(CALCULATE_INVOICE_TOTAL(invoice), 2);
  }

  getUnallocatedAmount(payment: PaymentAllocation, payAmnt: number): number {
    const amnt = payment.allocStatus == 5 ? payment.credit! - this.alloctedAmount: payAmnt - this.alloctedAmount;
    return amnt > 0 ? amnt : 0;
  }

  allocateTransaction() {
    this.allocating = true;
    this._allocationsService.allocatePayment(this.payment, this.selectedInvoices)
                            .subscribe(() => this.completeAllocationActions());
  }

  completeAllocationActions() {
    this.allocating = false;
    this._dialog.closeAll();
  }
}
