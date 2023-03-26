import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Contact } from '@volk/model/crm/contacts';
import { ContactsStore } from '@volk/state/crm/contacts';

@Injectable()
export class ActiveContactStore extends Store<Contact>
{
  protected store = 'active-contact-store';
  _activeContact: string;

  constructor(_contacts$$: ContactsStore,
    _router: Router) {
    super(null as any);

    const contacts$ = _contacts$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([contacts$, route$])
      .subscribe(([contacts, route]) => {
        const contactId = this._getRoute(route);

        if (contactId !== '__noop__') {
          const cont = contacts.find(j => j.id === contactId);

          if (cont) //&& this._activeContact !== contactId)
          {
            this._activeContact = cont.id as any;
            this.set(cont, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const orgId = elements.length >= 3 ? elements[2] : '__noop__';

    return orgId;
  }

}
