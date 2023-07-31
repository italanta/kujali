import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { KujaliPermissions } from '@app/model/organisation';
import { FAccount } from '@app/model/finance/accounts/main';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { AccountsStateService } from '@app/state/finance/banking';

@Injectable()
export class CanAccessAccountsDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  accounts$: Observable<FAccount[]>

  private activeAcc: FAccount;

  constructor(private router: Router,
              private authService: UserStore,
              private _accs$$: AccountsStateService,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.AccountsSettings.CanViewAccounts);
    this.accounts$ = this._accs$$.getFAccounts();

    return combineLatest([this.authService.getUser(), this.permission$, this.accounts$]) 
               .pipe(
                    tap(([u, p, c]) => {this.activeAcc = c.find(j => j.id === route.params['id'])!}),
                    map(([u, p, c]) => !!u && p && (!this.activeAcc.restricted || this.activeAcc.accessibleBy.includes(u.id!))),
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
