import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, map, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { KuUser } from '@app/model/common/user';
import { Invoice } from '@app/model/finance/invoices';

import { ActiveOrgStore } from '@app/state/organisation';
import { DataAccessQuery } from '@app/state/access-control';

@Injectable()
export class InvoicesStore extends DataStore<Invoice>
{
  protected store = 'invoices-store';
  protected _activeRepo: Repository<Invoice>;
  private _activeUser: KuUser;

  constructor(_activeOrg$$: ActiveOrgStore,
              private _dataAccessQuery: DataAccessQuery,
              _dataProvider: DataService,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Invoice>(`orgs/${o.id}/invoices`) : null as any),
                  tap(o  => this._activeUser = o?.activeUser!),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])),
                  map(invoices => this._dataAccessQuery.filterByAccess(invoices, this._activeUser)));

    this._sbS.sink = data$.subscribe(invoices => {
      this.set(invoices, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}