import { combineLatest, Observable, of } from 'rxjs';
import { switchMap, tap, filter, startWith } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { Query } from '@ngfire/firestore-qbuilder';
import { DataStore } from '@ngfi/state';

import { ActivefinanceObjectLoader } from '@app/state/finance/base'

import { Activity } from '@app/model/finance/activities';
import { ActiveOrgStore } from '@app/state/organisation';
import { financeObject } from '@app/model/finance/finance-object';
import { Router } from '@angular/router';


@Injectable()
export class ActivityStore extends DataStore<Activity>
{
  protected store = 'Activity-store';
  protected _activeRepo: Repository<Activity>;

  constructor(private _router$$: Router,
              private _org$$: ActiveOrgStore,
              private _financeObjLoader: ActivefinanceObjectLoader,
              private _dataProvider: DataService,
              protected _logger: Logger
    ) {
    super('always', _logger);

    const type  = this._router$$.url.split('/')[1];
    const id = this._router$$.url.split('/')[2];
    
    const data$
      = combineLatest(
        [_org$$.get(), _financeObjLoader.load().pipe(startWith({type : type, id: id}))])
        .pipe(tap(([o, c]) => {
          const store = c.type + '-activities';
          this._activeRepo =
            (!!o && _financeObjLoader.isValidfinanceObject(c)) ? _dataProvider.getRepo<Activity>(`orgs/${o.id}/${store}`) : null as any
        }),
          switchMap(([o, c]) =>
            !!this._activeRepo
              ? this._activeRepo.getDocuments(new Query().where('activityOwnerId', '==', c.id))
              : of([])));

    this._sbS.sink = data$.subscribe(activity => {
      this.set(activity, 'UPDATE - FROM DB');
    });
  }

  get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));

  getAllActions(orgId:string): Observable<[Activity[], Activity[], Activity[]]> {
    const companyActivities$ =this._dataProvider.getRepo<Activity>(`orgs/${orgId}/companies-activities`).getDocuments();
    const contactActivities$ =this._dataProvider.getRepo<Activity>(`orgs/${orgId}/contacts-activities`).getDocuments();
    const oppsActivities$ =this._dataProvider.getRepo<Activity>(`orgs/${orgId}/opportunities-activities`).getDocuments();
    return combineLatest([companyActivities$, contactActivities$, oppsActivities$]);
  }

  updateActionStatus(orgId:string, action: Activity) {
    let store = `${action.domainId}-activities`;
    let actionsRepo = this._dataProvider.getRepo<Activity>(`orgs/${orgId}/${store}`);

    actionsRepo.update(action).subscribe();
  }
}
