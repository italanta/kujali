import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Payment } from '@app/model/finance/payments';
import { KujaliPermissions } from '@app/model/organisation';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { PaymentsStateService } from '@app/state/finance/payments';

@Injectable()
export class CanAccessPaymentsDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  pays$: Observable<Payment[]>

  private activePay: any;

  constructor(private router: Router,
              private authService: UserStore,
              private _pays$$: PaymentsStateService,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.PaymentsSettings.CanViewPayments);
    this.pays$ = this._pays$$.getAllPayments();

    return combineLatest([this.authService.getUser(), this.permission$, this.pays$]) 
               .pipe(
                    tap(([u, p, c]) => {this.activePay = c.find(j => j.id === route.params['id'])!}),
                    map(([u, p, c]) => !!u && p && this.activePay ? (!this.activePay.restricted || this.activePay.accessibleBy.includes(u.id!)) : false),
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
