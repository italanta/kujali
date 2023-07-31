import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { tap } from 'rxjs';
import { SubSink } from 'subsink';

import { KuUser } from '@app/model/common/user';

import { OrganisationService } from '@app/state/organisation';

@Component({
  selector: 'kujali-org-users',
  templateUrl: './org-users.component.html',
  styleUrls: ['./org-users.component.scss']
})
export class OrgUsersFormField implements OnInit {
  private _sbS = new SubSink();

  @Input() restriction: boolean = false;
  @Input() parentForm: FormGroup;

  orgUsers: KuUser[];
  filteredUsers: KuUser[];

  fetchedUsers: boolean = false;

  constructor(private _orgsService$$: OrganisationService) 
  {    
  }

  ngOnInit(): void {
    this._getOrgUsers()
  }

  private _getOrgUsers() {    
    this._orgsService$$
      .getOrgUsersDetails()
      .pipe(tap((users) => {
        this.orgUsers = users;
        this.filteredUsers = this.orgUsers.slice();
        this.fetchedUsers = true;
      })).subscribe();
  }

  compareFn(c1, c2): boolean {
    return c1.id && c2.id ? c1.id === c2.id :c1 === c2;
  }
}
