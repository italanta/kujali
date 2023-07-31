import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, 
          RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Contact } from '@app/model/finance/contacts';
import { KujaliPermissions } from '@app/model/organisation';

import { UserStore } from '@app/state/user';
import { PermissionsStateService } from '@app/state/organisation';
import { ContactsStore } from '@app/state/finance/contacts';

@Injectable()
export class CanAccessContactsDetailGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;
  contacts$: Observable<Contact[]>

  private activeContact: Contact;

  constructor(private router: Router,
              private authService: UserStore,
              private contacts$$: ContactsStore,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: KujaliPermissions) => p.ContactsSettings.CanViewContacts);
    this.contacts$ = this.contacts$$.get();

    return combineLatest([this.authService.getUser(), this.permission$, this.contacts$]) 
               .pipe(
                    tap(([u, p, c]) => {this.activeContact = c.find(j => j.id === route.params['id'])!}),
                    map(([u, p, c]) => !!u && p && (!this.activeContact.restricted || this.activeContact.accessibleBy.includes(u.id!))),
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
