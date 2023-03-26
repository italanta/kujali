import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfire/angular';
import { DataStore } from '@ngfire/state';

import { Task } from '@volk/model/crm/activities';
import { ActiveOrgStore } from '@volk/state/orgs';

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
