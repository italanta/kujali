import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, switchMap, tap } from 'rxjs';

import { Payment } from '@app/model/finance/payments';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';
import { PaymentAllocation } from '@app/model/finance/allocations';

import { ActiveOrgStore } from '@app/state/organisation';

import { PaymentsAllocationsStore } from '../stores/payments-allocations.store';
import { InvoicesAllocationsStore } from '../stores/invoices-allocations.store';

import { REDUCE_INVOICE_ALLOC_AMOUNT } from '../providers/invoice-alloc-amount-reducer.function';


@Injectable({
  providedIn: 'root'
})
export class AllocationsStateService {

  constructor(private _aFF$$: AngularFireFunctions,
              private _activeOrg$$: ActiveOrgStore,
              private _paymentsAllocations$$: PaymentsAllocationsStore,
              private _invoicesAllocations$$: InvoicesAllocationsStore)
  { }

  getPaymentAllocations(): Observable<PaymentAllocation[]> {
    return this._paymentsAllocations$$.get();
  }

  getInvoicesAllocations(): Observable<InvoiceAllocation[]> {
    return this._invoicesAllocations$$.get();
  }

  allocatePayment(payment: Payment, invoices: Invoice[]) {
    return this._activeOrg$$.get()
                            .pipe(
                              switchMap((org) => this.perfomAllocationActions(org.id!, payment, invoices)))
  }

  perfomAllocationActions(orgId: string, payment: Payment, invoices: Invoice[]) {
    const allocsData = REDUCE_INVOICE_ALLOC_AMOUNT(payment, invoices);
    
    return this._aFF$$.httpsCallable('doAllocations')({orgId: orgId, allocs: allocsData})
                          .pipe(
                            tap((data) => {console.log(data)}),
                            switchMap((all) => this._aFF$$.httpsCallable('allocateBankPayments')({orgId: orgId, allocs: all})),
                            tap((data) => {console.log(data)}));
  }
}
