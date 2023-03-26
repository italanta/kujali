import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { Task } from '@app/model/finance/activities';
import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class TaskStore extends DataStore<Task>
{
  protected store = 'task-store';
  protected _activeRepo: Repository<Task>;

  constructor(_org$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected _logger: Logger
    ) {
    super('always', _logger);
    
    const data$
      = _org$$.get()
        .pipe(tap(o => {
          this._activeRepo =
            !!o ? _dataProvider.getRepo<Task>(`orgs/${o.id}/tasks`) : null as any
        }),
          switchMap((o) =>
            !!this._activeRepo
              ? this._activeRepo.getDocuments()
              : of([])));

    this._sbS.sink = data$.subscribe(task => {
      this.set(task, 'UPDATE - FROM DB');
    });
  }

  get = () => super.get().pipe(filter((tasks, i) => !!tasks && tasks.length >= 0));

}
