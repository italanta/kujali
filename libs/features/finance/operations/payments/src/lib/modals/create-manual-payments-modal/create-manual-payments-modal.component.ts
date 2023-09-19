import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest, tap } from 'rxjs';

import { __DateToStorage } from '@iote/time';

import { Company } from '@app/model/finance/companies';
import { Invoice } from '@app/model/finance/invoices';
import { BankTransaction, Payment } from '@app/model/finance/payments';

import { CompaniesService } from '@app/state/finance/companies';
import { InvoicesService } from '@app/state/finance/invoices';
import { PaymentsStore } from '@app/state/finance/payments';

import { CREATE_PAYMENTS_FORM } from '../../providers/create-payments-form.provider';

@Component({
  selector: 'app-create-manual-payments-modal',
  templateUrl: './create-manual-payments-modal.component.html',
  styleUrls: ['./create-manual-payments-modal.component.scss'],
})
export class CreateManualPaymentsModalComponent implements OnInit {

  private _sbS = new SubSink();

  addNewPaymentFormGroup: FormGroup;

  invoices: Invoice[];
  filteredInvoices: Invoice[];

  customers: Company[];
  filteredCustomers: Company[];

  platforms = [{name: 'Cash', value: 5}, {name: 'Bank', value: 3}, {name: 'Mpesa', value: 4}];
  filteredPlatforms = this.platforms;
  
  creatingPayment: boolean;

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _companies$$: CompaniesService,
              private _invoices$$: InvoicesService,
              private _payments$$: PaymentsStore
    ) {}

  ngOnInit(): void {
    this.addNewPaymentFormGroup = CREATE_PAYMENTS_FORM(this._fb);

    this._sbS.sink = combineLatest([this._companies$$.getCompanies(), this._invoices$$.getAllInvoices()])
                                    .pipe(tap(([companies, invoices]) => {
                                      this.customers = companies;
                                      this.filteredCustomers = this.customers;

                                      this.invoices = invoices;
                                      this.filteredInvoices = this.invoices;
                                    })).subscribe();
  }

  createPayment() {
    this.creatingPayment = true;

    if (this.addNewPaymentFormGroup.valid) {
      const formdata = this.addNewPaymentFormGroup.value;
      const invoices = formdata.invoice.map((invoice: Invoice) => invoice.id) ?? [];
      let payment: BankTransaction = {
        mode: 1,
        verified: true,
        amount: formdata.amount,
        date: __DateToStorage(formdata.date),
        from: '',
        fromAccName: '',
        to: formdata.customer.id ?? '',
        toAccName: formdata.customer.name ?? '',
        notes: formdata.note,
        for: invoices ?? [],
        type: 0,
        source: formdata.platform.value,
        ibanTo: '',
        ibanFrom: '',
        trStatus: '',
        description: '',
        originalTransaction: {}
      }
      
      this._payments$$.add(payment as BankTransaction).subscribe(() => {
        this.creatingPayment = false;
        this._dialog.closeAll();
      });
    }
  }
}
