import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Role } from '@app/model/roles';

import { ActiveOrgStore } from '@app/state/organisation';


@Injectable()
export class ContactRolesStore extends DataStore<Role>
{
  protected store = 'roles-store';
  protected _activeRepo: Repository<Role>;

  constructor(_dataProvider: DataService, _activeOrg$$: ActiveOrgStore,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      =  _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Role>(`orgs/${o.id}/contact-roles`) : null as any),
                  switchMap((o) => !!this._activeRepo 
                    ? this._activeRepo.getDocuments()
                    : of([])));
                    
    this._sbS.sink = data$.subscribe(contacts => {
      this.set(contacts, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}
