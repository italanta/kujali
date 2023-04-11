import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { InvoiceAllocation } from '@app/model/finance/invoices';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class InvoicesAllocationsStore extends DataStore<InvoiceAllocation>
{
  protected store = 'invoices-allocations-store';
  protected _activeRepo: Repository<InvoiceAllocation>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<InvoiceAllocation>(`orgs/${o.id}/invoices-allocs`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(allocations => {
      this.set(allocations, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}
