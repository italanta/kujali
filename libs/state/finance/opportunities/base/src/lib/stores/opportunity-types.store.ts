import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfire/angular';
import { Store } from '@iote/state';

import { OpportunityTypes } from '@volk/model/crm/opportunities';

import { ActiveOrgStore } from '@volk/state/orgs';

@Injectable()
export class OpportunityTypesStore extends Store<OpportunityTypes>
{
  protected store = 'opportunity-types-store';
  protected _activeRepo: Repository<OpportunityTypes>;
  CompaniesFeature: any;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected _logger: Logger)
  {
    super(null as any);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<OpportunityTypes>(`orgs/${o.id}/config`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocumentById('opportunity-types') : of()));

    this._sbS.sink = data$.subscribe(pportunityTypes => {
      this.set(pportunityTypes as OpportunityTypes);
    });
  } 

  get = () => super.get().pipe(filter((cts, i) => !!cts));

  create (pportunityTypes: any) {
    if(this._activeRepo){
      pportunityTypes.id = 'opportunity-types';
      return this._activeRepo.update(pportunityTypes).subscribe((success) => success);
    }

    throw new Error('OpportunityTypes state not avaialable.');

  }
}