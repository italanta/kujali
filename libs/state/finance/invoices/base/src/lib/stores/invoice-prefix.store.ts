import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Repository, DataService } from '@ngfire/angular';

import { Store } from '@iote/state';
import { Logger } from '@iote/bricks-angular';

import { InvoicesPrefix } from '@volk/model/crm/invoices';

import { ActiveCrmObjectLoader } from '@volk/state/crm/base'
import { ActiveOrgStore } from '@volk/state/orgs';

@Injectable()
export class InvoicesPrefixStore extends Store<InvoicesPrefix>
{
  protected store = 'invoices-prefix-store';
  protected _activeRepo: Repository<InvoicesPrefix>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _crmObjLoader: ActiveCrmObjectLoader,
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

  get = () => super.get().pipe(filter((cts, i) => !!cts));

  set(n: InvoicesPrefix)
  {
    if(this._activeRepo)
      return this._activeRepo.write(n, 'invoices-prefix');

    throw new Error('InvoicesPrefix state not avaialable.');
  }
}
