import { Injectable, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { User } from '@iote/bricks';
import { Store } from '@iote/state';

import { UserStore } from '@app/state/user';
import { Organisation } from '@app/model/organisation';

import { OrgStore } from './organisation.store';

@Injectable()
export class ActiveOrgStore extends Store<Organisation> implements OnDestroy
{
  protected store = 'active-org-store';
  private _activeOrg : string;

  constructor(_orgStore: OrgStore,
              _user$$: UserStore)
              // _router: Router)
  {
    super(null as any);

    const orgs$ = _orgStore.get();
    // const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
    //                                    map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([orgs$, _user$$.getUser()]) // route$])
                        .subscribe(([orgs, user]) => //route
    {
      const orgId = (user as User).id as string;

      const org = orgs.find(o => o.id === orgId);
      if(org && this._activeOrg !== orgId)
      {
        this._activeOrg = orgId;
        this.set(org, 'UPDATE - FROM DB || ROUTE');
      }
    });
  }

  override get = () => super.get().pipe(filter(val => val != null));

  setOrg(org: Organisation) {
    this.set({
      id: org.id,
      logoUrl: org?.logoUrl,
      name: org?.name,
      roles: org?.roles,
      users: org?.users,
    } as Organisation, 'UPDATE - FROM USER');
  }
  
  ngOnDestroy = () => this._sbS.unsubscribe();
}
