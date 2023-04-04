import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BankTransaction, Payment } from '@app/model/finance/payments';

import { AccountPaymentsQuery } from '../queries/account-payments.query';

import { PaymentsStore } from '../stores/payments.store';

@Injectable({
  providedIn: 'root'
})

export class PaymentsStateService {

  constructor(private _accPayQueries: AccountPaymentsQuery,
              private _paymentsStore$$: PaymentsStore) 
  { }

  getAllPayments(): Observable<BankTransaction[]> {
    return this._paymentsStore$$.get();
  }

  getAccountPayments(): Observable<BankTransaction[]> {
    return this._accPayQueries.get();
  }
}
