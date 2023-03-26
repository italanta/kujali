import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Company } from '@app/model/finance/companies';
import { CompaniesStore } from '@app/state/finance/companies';

@Injectable()
export class ActiveCompanyStore extends Store<Company>
{
  protected store = 'active-company-store';
  _activeCompany: string;

  constructor(_companies$$: CompaniesStore,
    _router: Router) {
    super(null as any);

    const companies$ = _companies$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([companies$, route$])
      .subscribe(([companies, route]) => {
        const companyId = this._getRoute(route);

        if (companyId !== '__noop__') {
          const cont = companies.find(j => j.id === companyId);

          if (cont) //&& this._activeCompany !== companyId)
          {
            this._activeCompany = cont.id as any;
            this.set(cont, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const orgId = elements.length >= 3 ? elements[2] : '__noop__';

    return orgId;
  }

}
