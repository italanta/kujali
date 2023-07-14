import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  title = 'Kujali';

  constructor(private _router$$: Router,
              private _activatedRoute$$: ActivatedRoute,
              private _title$$: Title
  ) {
    this._router$$.events.pipe(filter(event => event instanceof NavigationEnd),
                               map(() => this.getActivePageName()))
                          .subscribe((data: string) => {
                          if (data) 
                            this._title$$.setTitle('Kujali - '+ data);
                          });
  }

  getActivePageName() {
    let child = this._activatedRoute$$.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (child.snapshot.data && child.snapshot.data['title']) {
        return child.snapshot.data['title'];
      } else {
        return null;
      }
    }
    return null;
  }
}
