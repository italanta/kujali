import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Opportunity } from '@app/model/finance/opportunities';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class OpportunitiesStore extends DataStore<Opportunity>
{
  protected store = 'opportunities-store';
  protected _activeRepo: Repository<Opportunity>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Opportunity>(`orgs/${o.id}/opportunities`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

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
