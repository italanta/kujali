import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, of, switchMap } from 'rxjs';

import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';
import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

import { ActiveOrgStore } from '@app/state/organisation';

import { PaymentsAllocationsStore } from '../stores/payments-allocations.store';

@Injectable({
  providedIn: 'root'
})
export class PaymentAllocsStateService {

  constructor(private _aFF$$: AngularFireFunctions,
              private _activeOrg$$: ActiveOrgStore,
              private _allocations$$: PaymentsAllocationsStore) { }

  getPaymentAllocations(): Observable<PaymentAllocation[]> {
    return this._allocations$$.get();
  }

  allocatePayment(payment: Payment, invoices: Invoice[]) {
    return this._activeOrg$$.get()
                            .pipe(switchMap((org) => this._aFF$$.httpsCallable('allocateBankPayments')({orgId:org.id, payment, invoices })))
  }
}
