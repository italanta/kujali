import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';

import { Allocation } from '@app/model/finance/allocations';
import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

import { AllocationsStore } from '../stores/allocations.store';

@Injectable({
  providedIn: 'root'
})
export class AllocationsStateService {

  constructor(private _aFF$$: AngularFireFunctions,
              private _allocations$$: AllocationsStore) { }

  getAllocations(): Observable<Allocation[]> {
    return this._allocations$$.get();
  }

  createAllocation(allocation: Allocation): Observable<Allocation> {
    return this._allocations$$.add(allocation);
  }

  updateAllocation(allocation: Allocation): Observable<Allocation> {
    return this._allocations$$.update(allocation);
  }

  deleteAllocation(allocation: Allocation): Observable<Allocation> {
    return this._allocations$$.remove(allocation);
  }

  allocatePayment(payment: Payment, invoice: Invoice[]): Observable<any> {
    let paymentData = {payment, invoice};

    console.log('paymentData: ', paymentData)

    return this._aFF$$.httpsCallable('allocatePayment')({ payment, invoice });
  }
}
