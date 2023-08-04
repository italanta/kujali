import { Injectable } from "@angular/core";

import { combineLatest, map, of, switchMap, tap } from "rxjs";

import { DataService, Repository } from "@ngfi/angular";

import { ActiveOrgStore } from "@app/state/organisation";

import { ActiveDomainLoader } from "./base-domains/active-domain-loader.service";
import { Query } from "@ngfi/firestore-qbuilder";
import { KuUser } from "@app/model/common/user";

/**
 * This service is responsible for rendering budgets by counting up their 
 *  internal lines with their results.
 * 
 * @note This service is used for single use on page load of the budget explorer.
 * @note Should only be imported by BudgetExplorerQuery!
 */
@Injectable()
export class DataAccessQuery
{
  constructor(private _db: DataService,
              private _domainLoader$$: ActiveDomainLoader,
              private _activeOrg$$: ActiveOrgStore
  ) { }

  getAccessInfo()
  {
    let _activeRepo: Repository<any>;

    return combineLatest([this._activeOrg$$.get(), this._domainLoader$$.fetchDomainAccess()])
          .pipe(tap(([o, a])  =>
                {
                  _activeRepo = (!!o && this._domainLoader$$.isValidFinanceObject(a))
                                          ? this._db.getRepo<any>(`orgs/${o.id}/${a.type}/${a.id}/config`)
                                          : null as any
                }),
                switchMap(([o,c]) =>
                  !!_activeRepo ? _activeRepo.getDocumentById('accessInfo') : of()));
  }

  filterByAccess(docs: any[], activeUser: KuUser) {
    return docs.filter(i => !i.restricted || i.accessibleBy.includes(activeUser.id) || this._checkIfUserIsAdmin(activeUser));
  }

  private _checkIfUserIsAdmin(activeUser: KuUser) {
    return activeUser.roles[activeUser.profile.activeOrg]['admin']
  }
}