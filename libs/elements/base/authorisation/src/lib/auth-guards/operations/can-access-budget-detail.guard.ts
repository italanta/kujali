import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Budget } from '@app/model/finance/planning/budgets';
import { KujaliPermissions } from '@app/model/organisation';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';

@Injectable()
export class CanAccessBudgetsDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  budgets$: Observable<Budget[]>

  private activeBudget: Budget;

  constructor(private router: Router,
              private authService: UserStore,
              private _buds$$: BudgetsStateService,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.BudgetsSettings.CanViewBudgets);
    this.budgets$ = this._buds$$.getAllBudgets();

    return combineLatest([this.authService.getUser(), this.permission$, this.budgets$]) 
               .pipe(
                    tap(([u, p, c]) => {this.activeBudget = c.find(j => j.id === route.params['id'])!}),
                    map(([u, p, c]) => !!u && p && (!this.activeBudget.restricted || this.activeBudget.accessibleBy.includes(u.id!))),
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
