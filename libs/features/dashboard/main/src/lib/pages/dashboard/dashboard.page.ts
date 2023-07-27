import { Component, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable, map, switchMap, take, tap } from 'rxjs';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';

import { MetabaseService } from '@app/state/organisation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
 styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy
{
  private _sbS = new SubSink();

  user$: Observable<KuUser>;

  iframeUrl: string;
  generatingMetabaseLink: boolean = false

  constructor(private _userService: UserService<KuUser>,
              private _mbService: MetabaseService)
  {}

  ngOnInit(): void {
    this.user$ = this._userService.getUser();

    this.generateMetabaseLink();

    // this._sbS.sink = this.user$.pipe(tap((user) => 
    //   {
    //     if(!!user.profile.metabaseUrl && user.profile.metabaseUrl.length > 0)
    //     {
    //       this.iframeUrl = user.profile.metabaseUrl;
    //       this.generatingMetabaseLink = false;
    //     }
    //     else
    //     {
    //       this.generateMetabaseLink();
    //     }
    //   })).subscribe();
  }

  // addMetabseUrlOnUserProp(url: string) {
  //   return this.user$.pipe(take(1),
  //             tap((user) => user.profile.metabaseUrl = url),
  //             switchMap((user) => this._userService.updateUser(user)));
  // }

  //Call backend fn that generates metabase link
  generateMetabaseLink()
  {
    this.generatingMetabaseLink = true;

    this._mbService.getMetabaseLink().pipe(
                      tap((metabaseLink) => {
                            if (metabaseLink) {
                              this.iframeUrl = metabaseLink
                            }}),
                      tap(() => this.generatingMetabaseLink = false),
                      // switchMap((metabaseLink) => this.addMetabseUrlOnUserProp(metabaseLink)),
                      ).subscribe();
  }

  ngOnDestroy = () => { this._sbS.unsubscribe() }
}