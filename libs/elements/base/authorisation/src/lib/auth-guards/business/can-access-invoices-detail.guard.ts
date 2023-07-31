import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, 
          RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { KujaliPermissions } from '@app/model/organisation';
import { Invoice } from '@app/model/finance/invoices';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { InvoicesService } from '@app/state/finance/invoices';

@Injectable()
export class CanAccessInvoicesDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  invoices$: Observable<Invoice[]>

  private activeInv: Invoice;

  constructor(private router: Router,
              private authService: UserStore,
              private _invs$$: InvoicesService,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.InvoicesSettings.CanViewInvoices);
    this.invoices$ = this._invs$$.getAllInvoices();

    return combineLatest([this.authService.getUser(), this.permission$, this.invoices$]) 
               .pipe(
                    tap(([u, p, o]) => {this.activeInv = o.find(j => j.id === route.params['id'])!}),
                    map(([u, p, o]) => !!u && p && this.activeInv ? (!this.activeInv.restricted || this.activeInv.accessibleBy.includes(u.id!)) : false),
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
