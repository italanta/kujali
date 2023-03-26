import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { Repository, UserService, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Company } from '@app/model/finance/companies';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class CompaniesStore extends DataStore<Company>
{
  protected store = 'company-store';
  protected _activeRepo: Repository<Company>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Company>(`orgs/${o.id}/companies`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(company => {
      this.set(company, 'UPDATE - FROM DB');
    });
  }

  get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}
