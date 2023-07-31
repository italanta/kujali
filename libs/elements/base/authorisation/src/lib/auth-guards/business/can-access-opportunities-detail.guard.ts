import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, 
          RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { KujaliPermissions } from '@app/model/organisation';
import { Opportunity } from '@app/model/finance/opportunities';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { OpportunitiesStore } from '@app/state/finance/opportunities';

@Injectable()
export class CanAccessOpportunitiesDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  opportunities$: Observable<Opportunity[]>

  private activeOpps: Opportunity;

  constructor(private router: Router,
              private authService: UserStore,
              private _opps$$: OpportunitiesStore,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.OpportunitiesSettings.CanViewOpportunities);
    this.opportunities$ = this._opps$$.get();

    return combineLatest([this.authService.getUser(), this.permission$, this.opportunities$]) 
               .pipe(
                    tap(([u, p, o]) => {this.activeOpps = o.find(j => j.id === route.params['id'])!}),
                    map(([u, p, o]) => !!u && p && (!this.activeOpps.restricted || this.activeOpps.accessibleBy.includes(u.id!))),
                     tap(canNavigate => {
                        if(!canNavigate)
                          this.router.navigate(['/access-denied']);
                     })
                );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean>
  {
    return this.authService
               .getUser()
               .pipe(map(u => !!u));
  }

}
