import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Allocation } from '@app/model/finance/allocations';

import { AllocationsStore } from '../stores/allocations.store';
import { FTransaction } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

@Injectable({
  providedIn: 'root'
})
export class AllocationsStateService {

  constructor(private _allocations$$: AllocationsStore) { }

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

  allocatePayment(payment: FTransaction, invoice: Invoice) {
    let allocation : Allocation = {
      invoiceId: invoice.id!,
      paymentId: payment.id!,
      amount: payment.amount
    }

    return this.createAllocation(allocation);
  }
}
