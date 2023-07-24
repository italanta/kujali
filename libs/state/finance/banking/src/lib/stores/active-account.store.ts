import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStore } from './accounts.store';

@Injectable()
export class ActiveFAccountStore extends Store<FAccount>
{
  protected store = 'active-account-store';
  _activeAccount: string;

  constructor(_accounts$$: AccountsStore,
              _router: Router
  ) {

    super(null as any);

    const accounts$ = _accounts$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([accounts$, route$])
      .subscribe(([accounts, route]) => {
        const accountId = this._getRoute(route);

        if (accountId !== '__noop__') {
          const cont = accounts.find(j => j.id === accountId);

          if (cont)
          {
            this._activeAccount = cont.id as any;
            this.set(cont, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const accountId = elements.length > 3 ? elements[3] : '__noop__';
    return accountId;
  }
}