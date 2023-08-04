import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { KuUser } from '@app/model/common/user';
import { FAccount } from '@app/model/finance/accounts/main';

import { ActiveOrgStore } from "@app/state/organisation";
import { DataAccessQuery } from '@app/state/access-control';

@Injectable()
export class AccountsStore extends DataStore<FAccount>
{
  protected store = 'accounts-store';
  protected _activeRepo: Repository<FAccount>;

  private _activeUser: KuUser;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              private _dataAccessQuery: DataAccessQuery,
              protected override _logger: Logger
  ) {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<FAccount>(`orgs/${o.id}/accounts`) : null as any),
                  tap(o  => this._activeUser = o?.activeUser!),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])),
                  map(accounts => this._dataAccessQuery.filterByAccess(accounts, this._activeUser!)));

    this._sbS.sink = data$.subscribe(accounts => {
      this.set(accounts, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}