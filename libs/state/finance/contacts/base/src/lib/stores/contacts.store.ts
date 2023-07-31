import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, UserService, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { KuUser } from '@app/model/common/user';
import { Contact } from '@app/model/finance/contacts';

import { ActiveOrgStore } from '@app/state/organisation';
import { DataAccessQuery } from '@app/state/access-control';

@Injectable()
export class ContactsStore extends DataStore<Contact>
{
  protected store = 'contacts-store';
  protected _activeRepo: Repository<Contact>;

  private _activeUser: KuUser;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              private _dataAccessQuery: DataAccessQuery,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Contact>(`orgs/${o.id}/contacts`) : null as any),
                  tap(o  => this._activeUser = o?.activeUser!),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])),
                  map(contacts => this._dataAccessQuery.filterByAccess(contacts, this._activeUser!)));

    this._sbS.sink = data$.subscribe(contacts => {
      this.set(contacts, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));

  //updaterepo
  public updateContact(contact: Contact){
    return this._activeRepo.update(contact)
  }

}
