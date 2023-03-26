import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Opportunity } from '@app/model/finance/opportunities';
import { OpportunitiesStore } from '@app/state/finance/opportunities';

@Injectable()
export class ActiveOpportunityStore extends Store<Opportunity>
{
  protected store = 'active-opportunity-store';
  _activeOps: string;

  constructor(_ops$$: OpportunitiesStore,
    _router: Router) {
    super(null as any);

    const ops$ = _ops$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([ops$, route$])
      .subscribe(([ops, route]) => {
        const opsId = this._getRoute(route);

        if (opsId !== '__noop__') {
          const op = ops.find(j => j.id === opsId);

          if (op)
          {
            this._activeOps = op.id as any;
            this.set(op, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const opsId = elements.length >= 3 ? elements[2] : '__noop__';

    return opsId;
  }

}
