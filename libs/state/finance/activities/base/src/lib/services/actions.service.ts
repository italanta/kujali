import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as moment from 'moment';

import { __DateToStorage } from '@iote/time';
import { TranslateService } from '@ngfire/multi-lang';

import { Activity } from '@volk/model/crm/activities';

import { OrganisationService } from '@volk/state/orgs';

import { ActivityStore } from '../stores/acitvity.store';

@Injectable({
  providedIn: 'root'
})

export class ActionsService {

  private _sbS = new SubSink();

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _router$$: Router,
              private _snackBar: MatSnackBar,
              private _translateService: TranslateService,
              private _orgService: OrganisationService,
              private _activity$$: ActivityStore,
  ) { }


  getAllActions(): Observable<[Activity[], Activity[], Activity[]]> {
    return this._orgService.getActiveOrg().pipe(switchMap((org) => !!org ? this._activity$$.getAllActions(org.id!) : []));
  }

  submitAction(addNewActionForm: FormGroup) {
    const route = this._router$$.url.split('/');
    const id = route[2];
    const domain = route[1];

    addNewActionForm.value.startDate = moment( addNewActionForm.value.startDate);
    addNewActionForm.value.startDate = __DateToStorage(addNewActionForm.value.startDate);

    addNewActionForm.value.endDate = moment( addNewActionForm.value.endDate);
    addNewActionForm.value.endDate = __DateToStorage(addNewActionForm.value.endDate);

    addNewActionForm.value.activityOwnerId = id;
    addNewActionForm.value.domainId = domain;
    
    this._sbS.sink = this._activity$$
      .add(addNewActionForm.value as Activity)
      .subscribe((success) => {
        this.openSnackBar();
      })
  }

  updateAction(addNewActionForm: Activity) {    
    this._sbS.sink = this._activity$$
      .update(addNewActionForm as Activity)
      .subscribe((success) => {
        this.openSnackBar();
      })
  }

  updateActionStatus(orgId: string, action: Activity) {
    return this._activity$$.updateActionStatus(orgId, action);
  }

  deleteAction(action: Activity) {
    this._activity$$.remove(action);
  }

  openSnackBar() {
    this._snackBar.open(
      this._translateService.translate('ACTIVITY.SNACKBAR.CREATE-ACTIVITY'),
      'Close',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration : 2000
      },
    );
  }
}
