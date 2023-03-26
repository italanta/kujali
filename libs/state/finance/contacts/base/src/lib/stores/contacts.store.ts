import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, UserService, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { Contact } from '@app/model/finance/contacts';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class ContactsStore extends DataStore<Contact>
{
  protected store = 'contacts-store';
  protected _activeRepo: Repository<Contact>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected override _logger: Logger)
  {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<Contact>(`orgs/${o.id}/contacts`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

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
