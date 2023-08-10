import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Expenses } from '@app/model/finance/operations/expenses';
import { ExpensesStore } from './expenses.store';

@Injectable()
export class ActiveExpenseStore extends Store<Expenses>
{
  protected store = 'active-expense-store';
  _activeExpense: string;

  constructor(_expenses$$: ExpensesStore,
              _router: Router)
  {
    super(null as any);

    const expenses$ = _expenses$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([expenses$, route$])
      .subscribe(([exps, route]) => {
        const expId = this._getRoute(route);

        if (expId !== '__noop__') {
          const exp = exps.find(j => j.id === expId);

          if (exp)
          {
            this._activeExpense = exp.id as string;
            this.set(exp, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const orgId = elements.length >= 3 ? elements[3] : '__noop__';

    return orgId;
  }
}
