import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, of, switchMap } from 'rxjs';

import { Allocation } from '@app/model/finance/allocations';
import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';

import { AllocationsStore } from '../stores/allocations.store';
import { ActiveOrgStore } from '@app/state/organisation';

@Injectable({
  providedIn: 'root'
})
export class AllocationsStateService {

  constructor(private _aFF$$: AngularFireFunctions,
              private _activeOrg$$: ActiveOrgStore,
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

  allocatePayment(payment: Payment, invoices: Invoice[]) {
    return this._activeOrg$$.get()
                            .pipe(switchMap((org) => this._aFF$$.httpsCallable('allocateBankPayments')({orgId:org.id, payment, invoices })))
  }
}
