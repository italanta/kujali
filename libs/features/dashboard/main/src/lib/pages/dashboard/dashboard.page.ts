import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService } from '@ngfi/angular';
import { MetabaseService } from '@app/state/organisation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
 styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent
{
  user$: Observable<User>;
  loading = true;

  iframeUrl: string;

  constructor(_userService: UserService<User>,
              private _mbService: MetabaseService)
  {
    this.user$ = _userService.getUser();
    
    this.user$.subscribe(user => 
                          {
                            this.generateMetabaseLink()
                            this.loading = false;

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
    this._mbService.getMetabaseLink().subscribe(res => {
      this.loading = false;
      this.iframeUrl = res;
    });
  }

}
