import { combineLatest, of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';

import { ActivefinanceObjectLoader } from '@app/state/finance/base'

import { Store } from '@iote/state';

import { Notes } from '@app/model/finance/notes';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class NotesStore extends Store<Notes>
{
  protected store = 'notes-store';
  protected _activeRepo: Repository<Notes>;

  constructor(
              _activeOrg$$: ActiveOrgStore,
              _financeObjLoader: ActivefinanceObjectLoader,
              _dataProvider: DataService,
              protected _logger: Logger
  )
  {
    super(null as any);

    const data$
      = combineLatest([_activeOrg$$.get(), _financeObjLoader.load()])
            .pipe(tap(([o, a])  =>
                  {                                    
                    // TODO: Type = finance Object
                    this._activeRepo =
                      (!!o && _financeObjLoader.isValidfinanceObject(a))
                                 ? _dataProvider.getRepo<any>(`orgs/${o.id}/${a.type}/${a.id}/config`)
                                 : null as any
                  }),
                  switchMap(([o,c]) =>
                    !!this._activeRepo ? this._activeRepo.getDocumentById('notes')
                                     : of()));


    this._sbS.sink = data$.subscribe(notes => {
      super.set(notes as Notes, 'UPDATE - FROM DB');
    });
  }

  get = () => super.get().pipe(filter((cts, i) => !!cts));

  set(n: Notes)
  {
    if(this._activeRepo)
      return this._activeRepo.write(n, 'notes');

    throw new Error('Notes state not avaialable.');
  }
}
