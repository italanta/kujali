import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { KujaliFeaturePermission, KujaliPermissions } from '@app/model/organisation';
import { Company } from '@app/model/finance/companies';
import { ActiveCompanyStore, CompaniesStore } from '@app/state/finance/companies';

@Injectable()
export class CanAccessCompaniesDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  company$: Observable<Company[]>

  private activeCompany: Company;

  constructor(private router: Router,
              private authService: UserStore,
              private company$$: CompaniesStore,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.CompanySettings.CanViewCompanies);
    this.company$ = this.company$$.get();

    return combineLatest([this.authService.getUser(), this.permission$, this.company$]) 
               .pipe(
                    tap(([u, p, c]) => {this.activeCompany = c.find(j => j.id === route.params['id'])!}),
                    map(([u, p, c]) => !!u && p && (!this.activeCompany.restricted || this.activeCompany.accessibleBy.includes(u.id!))),
                     tap(canNavigate => {
                        if(!canNavigate)
                          this.router.navigate(['/home']);
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
