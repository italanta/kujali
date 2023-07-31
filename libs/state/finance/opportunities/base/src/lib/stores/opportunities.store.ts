import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { KuUser } from '@app/model/common/user';
import { Opportunity } from '@app/model/finance/opportunities';

import { ActiveOrgStore } from '@app/state/organisation';
import { DataAccessQuery } from '@app/state/access-control';

@Injectable()
export class OpportunitiesStore extends DataStore<Opportunity>
{
  protected store = 'opportunities-store';
  protected _activeRepo: Repository<Opportunity>;

  private _activeUser: KuUser;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              private _dataAccessQuery: DataAccessQuery,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Opportunity>(`orgs/${o.id}/opportunities`) : null as any),
                  tap(o  => this._activeUser = o?.activeUser!),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])),
                  map(opps => this._dataAccessQuery.filterByAccess(opps, this._activeUser!)));

    this._sbS.sink = data$.subscribe(opportunity => {
      this.set(opportunity, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((ops, i) => !!ops && ops.length >= 0));

  //updaterepo
  public updateContact(opportunity: Opportunity){
    return this._activeRepo.update(opportunity)
  }
}
