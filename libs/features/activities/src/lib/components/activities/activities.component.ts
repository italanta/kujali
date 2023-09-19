import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';
import { take } from 'rxjs/operators';

import { __DateFromStorage } from '@iote/time';
import { TranslateService } from '@ngfi/multi-lang';

import { KuUser } from '@app/model/common/user';
import { Activity } from '@app/model/finance/activities';
import { KujaliPermissions } from '@app/model/organisation';

import { KujaliUsersService } from '@app/state/user';
import { ActivityStore } from '@app/state/finance/activities';
import { PermissionsStateService } from '@app/state/organisation';

@Component({
  selector: 'activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})

export class ActivitiesComponent implements OnInit, AfterViewInit {
  private _sbS = new SubSink();

  @Input() canViewActions: boolean;

  _page: string;
  sorting$$ = new BehaviorSubject<ActionSortingOptions>(
    ActionSortingOptions.Newest
  );

  activityEditClicked : Subject<Activity> = new Subject();

  activities$: Observable<Activity[]>;
  action: Activity;

  sortby: string = 'newest';
  date: string;

  canEditActions: boolean = true;

  lang: 'fr' | 'en' | 'nl';

  constructor(private _router$$: Router,
              private _translateService: TranslateService,
              private _activity$$: ActivityStore,
              private cdref: ChangeDetectorRef,
              private _permissionsService: PermissionsStateService,
              private _kujaliUsersService: KujaliUsersService
  ) {}

  ngOnInit(): void {
    this.lang = this._translateService.initialise();
    this.activities$ = this._activity$$.get();

    this._page = this._router$$.url.split('/')[2];

    this.activities$ = combineLatest([this.activities$, this.sorting$$.asObservable(),
        ]).pipe(map(([acts, sort]) =>
                  _.orderBy(acts,(a) => __DateFromStorage(a.endDate).unix(),
                    sort === ActionSortingOptions.Newest ? 'desc' : 'asc'
                  )));

    this._checkPermissions();
  }

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  private _checkPermissions() {
    this._sbS.sink = this._permissionsService
      .checkAccessRight(this.getPermissionsDomain())
      .pipe(take(1))
      .subscribe((permissions) => {
        if (permissions == true) {
          this.canEditActions = true;
        }
      });
  }

  getPermissionsDomain() {
    switch (this._page) {
      case 'companies':
        return (p: KujaliPermissions) => p.CompanySettings.CanEditCompanyActions;
      case 'contacts':
        return (p: KujaliPermissions) => p.ContactsSettings.CanEditContactActions;
      case 'opportunities':
        return (p: KujaliPermissions) => p.OpportunitiesSettings.CanEditOpportunitiesActions;
      case 'expenses':
        return (p: KujaliPermissions) => p.ExpensesSettings.CanEditExpensesActions;
      default:
        return;
    }
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getInitials(assignTo: string): string {
    let initials: any = assignTo;
    let firstInitial = initials.toString().split(' ')[0];
    let secondInitial = initials.toString().split(' ')[1];

    return firstInitial.charAt(0) + secondInitial.charAt(0);
  }

  getOrgUsers(userIds: string[]): KuUser[] {
    let users = this._kujaliUsersService.getOrgUsersProperties(userIds);
    return users;
  }

  sendActionToForm(action: Activity) {
    this.activityEditClicked.next(action);
  }

  sortBy(value: ActionSortingOptions): void {
    this.sorting$$.next(value);
  }

  getDate(dateValue : any, dateFormat: string) : any {
    return __DateFromStorage(dateValue).format(dateFormat);
  }

  ngOnDestroy () {
    this._sbS.unsubscribe();
  }
}

enum ActionSortingOptions {
  Oldest = 'oldest',
  Newest = 'newest'
}