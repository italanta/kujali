import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Repository, DataService } from '@ngfi/angular';

import { Store } from '@iote/state';
import { Logger } from '@iote/bricks-angular';

import { InvoicesPrefix } from '@app/model/finance/invoices';

import { ActiveFinanceObjectLoader } from '@app/state/finance/base'
import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class InvoicesPrefixStore extends Store<InvoicesPrefix>
{
  protected store = 'invoices-prefix-store';
  protected _activeRepo: Repository<InvoicesPrefix>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _financeObjLoader: ActiveFinanceObjectLoader,
              _dataProvider: DataService,
              protected _logger: Logger
  )
  {
    super(null as any);

    const data$ = _activeOrg$$.get()
            .pipe(tap((o)  =>
                  {                                    
                    this._activeRepo = (!!o) ? _dataProvider.getRepo<any>(`orgs/${o.id}/config`) : null as any
                  }),
                  switchMap((o) => !!this._activeRepo ? this._activeRepo.getDocumentById('invoices-prefix')
                                                      : of()));

    this._sbS.sink = data$.subscribe(invoicesPrefix => {
      super.set(invoicesPrefix as InvoicesPrefix, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts));

  override set(n: InvoicesPrefix)
  {
    if(this._activeRepo)
      return this._activeRepo.write(n, 'invoices-prefix');

    throw new Error('InvoicesPrefix state not avaialable.');
  }
}
