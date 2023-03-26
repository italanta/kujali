import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';

import { flatMap as __flatMap, find as __find, keys as __keys } from 'lodash';

import { AuthService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';

import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/state/organisation';

import { UserStore } from '../stores/user.store';

@Injectable({
  providedIn: 'root',
})
export class KujaliUsersService {
  private _sbS = new SubSink();

  org: Organisation;
  orgUsers: KuUser[];

  constructor(private _dialog: MatDialog,
              private _bs: AngularFireFunctions,
              private _user$$: UserStore,
              private _orgsService: OrganisationService,
              private _authService: AuthService
  ) 
  {
    this.getOrg();
  }

  updateUserDetails(user: KuUser, userFormGroup: FormGroup) {
    user.displayName = `${userFormGroup.value.firstName} ${userFormGroup.value.lastName}`;
    user.roles[this.org.id!] = this.createUSerRoles(__keys(user.roles[this.org.id!]), userFormGroup.value.roles, true);
    this._user$$.updateUser(user).then(() => this._dialog.closeAll());
  }

  updateUserName(user: KuUser, userFormGroup: FormGroup) {
    user.displayName = `${userFormGroup.value.firstName} ${userFormGroup.value.lastName}`;
    this._user$$.updateUser(user).then(() => this._dialog.closeAll());
  }

  getOrg() {
    this._sbS.sink = this._orgsService.getActiveOrg().subscribe((org) => {
      if (org?.id) {
        this.org = org;
        this.getAllOrgUsers(org.id);
      }
    });
  }

  getAllOrgUsers(org: string) {
    this._sbS.sink = this._orgsService.getOrgUsersDetails()
      .subscribe((users) => {
        this.orgUsers = users;
      });
  }

  getOrgUsers(userIds: string[]): string[] {
    if (this.orgUsers) {
      let users: any = this.orgUsers.filter((users) =>
        userIds.includes(users.id!)
      );
      users = __flatMap(users, 'displayName');
      return users;
    }
    return [];
  }

  getOrgUsersProperties(userIds: string[]): KuUser[] {
    if (this.orgUsers) {
      let users = this.orgUsers.filter((users) => userIds.includes(users.id!));
      return users;
    }
    return [];
  }

  getOrgUser(userId: string): string {
    let user: any = __find(this.orgUsers, { id: userId });
    return user;
  }

  isUserAssignedRole(role: string, roles: string[]): boolean {
    return roles.includes(role);
  }

  addUserToOrg(userFormGroup: FormGroup) {
    let userData = userFormGroup.value;
    let user: KuUser = {
      displayName: `${userData.firstName} ${userData.lastName}`,
      profile: {
        orgIds: [this.org.id!],
        activeOrg: this.org.id!,
        budgets: {},
        phone: userData?.phone ?? '',
      },
      roles: {
        [this.org.id!] : this.createUSerRoles(this.org.roles, userData.roles, false),
        access: true,
      },
      uid: '',
      email: userData.email,
    };    
    this._bs.httpsCallable('createNewUser')(user).subscribe();
  }

  createUSerRoles(orgRoles: string[], roles: string[], editingUser: boolean): {} {    
    let rolesObj: {} = {};
    orgRoles.forEach((orgRole) => {
      rolesObj[orgRole] = roles.includes(orgRole) ? true : false;
    })

    if (!editingUser) {
      rolesObj['access'] = false;
      rolesObj['principal'] = false;
    }

    return rolesObj;
  }

  updateUserPhotoUrl(userData: KuUser, fileUrl: string) {
    userData.photoUrl = fileUrl;
    this._user$$.updateUser(userData);
  }

  updatePassword(email: string) {
    this._authService.resetPassword(email);
  }
}