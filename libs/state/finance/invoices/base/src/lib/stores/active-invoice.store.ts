import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Invoice } from '@app/model/finance/invoices';

import { InvoicesStore } from './invoices.store';

@Injectable()
export class ActiveInvoiceStore extends Store<Invoice>
{
  protected store = 'active-invoice-store';
  _activeInvoice: string;

  constructor(_invoices$$: InvoicesStore,
    _router: Router) {
    super(null as any);

    const invoices$ = _invoices$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([invoices$, route$])
      .subscribe(([invoices, route]) => {
        const invoiceId = this._getRoute(route);

        if (invoiceId !== '__noop__') {
          const cont = invoices.find(j => j.id === invoiceId);

          if (cont) //&& this._activequote !== invoiceId)
          {
            this._activeInvoice = cont.id as any;
            this.set(cont, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const invoiceId = elements.length >= 3 ? elements[3] : '__noop__';
    return invoiceId;
  }
}