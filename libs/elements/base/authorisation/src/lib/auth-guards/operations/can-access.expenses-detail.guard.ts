import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { KujaliPermissions } from '@app/model/organisation';
import { Expenses } from '@app/model/finance/operations/expenses';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';

@Injectable()
export class CanAccessExpensesDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  expenses$: Observable<Expenses[]>

  private activeExp: Expenses;

  constructor(private router: Router,
              private authService: UserStore,
              private _exps$$: ExpensesStateService,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.ExpensesSettings.CanViewExpenses);
    this.expenses$ = this._exps$$.getAllExpenses();

    return combineLatest([this.authService.getUser(), this.permission$, this.expenses$]) 
               .pipe(
                    tap(([u, p, c]) => {this.activeExp = c.find(j => j.id === route.params['id'])!}),
                    map(([u, p, c]) => !!u && p && this.activeExp ? (!this.activeExp.restricted || this.activeExp.accessibleBy.includes(u.id!)) : false),
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
