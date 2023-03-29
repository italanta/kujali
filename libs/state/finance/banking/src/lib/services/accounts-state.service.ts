import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FTransaction } from '@app/model/finance/payments';
import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStore } from '../stores/accounts.store';
import { ActiveFAccountStore } from '../stores/active-account.store';
import { AccountsTransactionsStore } from '../stores/account-trs.store';

@Injectable({
  providedIn: 'root'
})
export class AccountsStateService {

  constructor(private _accounts$$: AccountsStore,
              private _activeAccount$$: ActiveFAccountStore,
              private _accountsTrs$$: AccountsTransactionsStore
  ) { }

  getFAccounts() {
    return this._accounts$$.get();
  }
  
  createNewAccount(account: FAccount): Observable<FAccount> {
    return this._accounts$$.add((account as FAccount));
  }

  updateAccount(account: FAccount): Observable<FAccount> {
    return this._accounts$$.update(account);
  }

  deleteAccount(account: FAccount): Observable<FAccount> {
    return this._accounts$$.remove(account);
  }

  getActiveFAccount(): Observable<FAccount> {
    return this._activeAccount$$.get();
  }

  getAllAccountsTransactions(): Observable<FTransaction[]> {
    return this._accountsTrs$$.get();
  }
}
