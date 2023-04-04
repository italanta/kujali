import { Injectable } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';

import { filter, map, tap } from 'rxjs/operators';

import { FAccount } from '@app/model/finance/accounts/main';
import { BankTransaction, Payment } from '@app/model/finance/payments';

import { AccountsStateService } from '@app/state/finance/banking';

import { PaymentsStateService } from '../services/payments-state.service';

import { PaymentsStore } from '../stores/payments.store';


/**
 * Query to load all payments for an account.
 */
@Injectable()
export class AccountPaymentsQuery
{
  protected store = 'account-payments-query';

  constructor(private _accountsService: AccountsStateService,
              private _paymentsService: PaymentsStateService,
              private _paymentsStore$$: PaymentsStore
  ) {}

  /**
   * Retrieves the payment allocation status for a payment
   *    and combines the information into a PaymentLine.
   */
  get(): Observable<BankTransaction[]>
  {
    return combineLatest([this._accountsService.getActiveFAccount(), this._paymentsStore$$.get()])
                          .pipe(map(([acc, trs]) => this.applyPaymentsFilter(acc, trs)));
  }

  applyPaymentsFilter(acc: FAccount, trs: BankTransaction[]) {
    return trs.filter((tr: BankTransaction)  => (tr.ibanFrom == acc.iban || tr.ibanTo == acc.iban));
  }

}
