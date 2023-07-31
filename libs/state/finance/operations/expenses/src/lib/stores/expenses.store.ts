import { Injectable } from "@angular/core";

import { of } from "rxjs";
import { filter, map, switchMap, tap } from "rxjs/operators";

import { orderBy as ___orderBy, includes as ___includes } from 'lodash';

import { Logger } from "@iote/bricks-angular";
import { DataService, Repository } from "@ngfi/angular";
import { DataStore } from "@ngfi/state";

import { KuUser } from "@app/model/common/user";
import { Organisation } from "@app/model/organisation";
import { Expenses } from "@app/model/finance/operations/expenses";

import { ActiveOrgStore } from "@app/state/organisation";
import { DataAccessQuery } from "@app/state/access-control";

@Injectable()
export class ExpensesStore extends DataStore<Expenses>
{
  private _org!: Organisation;
  protected _activeRepo!: Repository<Expenses>;
  protected store: string = 'expenses-store'; 

  private _activeUser: KuUser;

  constructor(org$$: ActiveOrgStore,
              dataService: DataService,
              private _dataAccessQuery: DataAccessQuery,
              _logger: Logger
  ) {
    super('always', _logger);

    const data$ = org$$.get()
            .pipe(tap((o) => this._activeRepo = !!o ? dataService.getRepo<Expenses>(`orgs/${o.id}/expenses`) 
                                                    : null as any),
                  tap((o) => this._activeUser = o.activeUser!),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])),
                  map(contacts => this._dataAccessQuery.filterByAccess(contacts, this._activeUser!)));

    this._sbS.sink = data$.subscribe(expenses => {
      this.set(expenses, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter(bs => !!bs));
}
