import { Component, OnInit } from '@angular/core';

import { SubSink } from 'subsink';

import { Observable, tap } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService } from '@ngfi/angular';

import { MetabaseService } from '@app/state/organisation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
 styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit
{
  private _sbS = new SubSink();

  user$: Observable<User>;

  iframeUrl: string;
  generatingMetabaseLink: boolean = false

  constructor(_userService: UserService<User>,
              private _mbService: MetabaseService)
  {
    this.user$ = _userService.getUser();
  }

  ngOnInit(): void {
    this.generateMetabaseLink()
  }

  assignUserMetabaseUrl() {
    this._sbS.sink = this.user$.subscribe(user => 
      {
        // if(!!user.profile.metabaseUrl)
        // {
        //   this.iframeUrl = user.profile.metabaseUrl;
        //   this.loading = false;
        // }
        // else
        // {
        //   this.generateMetabaseLink()
        // }
      })
  }

  //Call backend fn that generates metabase link
  generateMetabaseLink()
  {
    this.generatingMetabaseLink = true;

    this._mbService.getMetabaseLink()
                            .pipe(tap((metabaseLink) => {
                                    if (metabaseLink) {
                                      this.iframeUrl = metabaseLink;
                                      this.generatingMetabaseLink = false;
                                    }}))
                            .subscribe();
  }

}
