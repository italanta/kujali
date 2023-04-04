import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Payment } from '@app/model/finance/payments';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class AllocationsStore extends DataStore<Payment>
{
  protected store = 'payments-store';
  protected _activeRepo: Repository<Payment>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Payment>(`orgs/${o.id}/payments`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(payments => {
      this.set(payments, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}
