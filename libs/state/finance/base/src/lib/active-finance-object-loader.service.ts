import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';


import { __isValidFinanceObjectDomain } from './allowed-note-domains.fn';

@Injectable()
export class ActiveFinanceObjectLoader
{
  constructor(private _router$$: Router,
              protected _logger: Logger)
  { }

  public load()
  {
    return this._getArtifect();
  }

  private _getArtifect()
  {
    return this._getActiveRoute()
               .pipe(map(r => { 
                 const els = r.url.split('/');
                                return { type: els.length >= 1 ? els[1] : false,
                                          id: els.length >= 2 ? els[2] : false };
                }));
  }

  private _getActiveRoute()
  {
   return this._router$$.events.pipe(filter(ev => ev instanceof NavigationEnd),
                                     map(ev => ev as NavigationEnd));
  }

  public isValidFinanceObject(artifect: any)
  {
    return !!artifect.type && artifect.id
              && __isValidFinanceObjectDomain(artifect.type as string);
  }
}
