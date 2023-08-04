import { of } from 'rxjs';
import { switchMap, tap, filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { Repository, UserService, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Company } from '@app/model/finance/companies';
import { KuUser } from '@app/model/common/user';

import { ActiveOrgStore } from '@app/state/organisation';
import { DataAccessQuery } from '@app/state/access-control';

@Injectable()
export class CompaniesStore extends DataStore<Company>
{
  protected store = 'company-store';
  protected _activeRepo: Repository<Company>;

  private _activeUser: KuUser;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              private _dataAccessQuery: DataAccessQuery,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Company>(`orgs/${o.id}/companies`) : null as any),
                  tap(o  => this._activeUser = o?.activeUser!),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])),
                  map(companies => this._dataAccessQuery.filterByAccess(companies, this._activeUser!)));

    this._sbS.sink = data$.subscribe(company => {
      this.set(company, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}
