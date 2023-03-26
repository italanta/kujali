import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { Repository, UserService, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Invoice } from '@app/model/finance/invoices';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class InvoicesStore extends DataStore<Invoice>
{
  protected store = 'invoices-store';
  protected _activeRepo: Repository<Invoice>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Invoice>(`orgs/${o.id}/invoices`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(invoices => {
      this.set(invoices, 'UPDATE - FROM DB');
    });
  }

  get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}