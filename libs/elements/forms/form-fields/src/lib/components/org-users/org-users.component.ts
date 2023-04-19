import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  @Input() parentForm: FormGroup;

  orgUsers: KuUser[];
  filteredUsers: KuUser[];

  constructor(private _orgsService$$: OrganisationService) 
  { }

  ngOnInit(): void {
    this._getOrgUsers()
  }

  private _getOrgUsers() {    
    this._sbS.sink = this._orgsService$$
      .getOrgUsersDetails()
      .subscribe((users) => {
        this.orgUsers = users;
        this.filteredUsers = this.orgUsers.slice();
      });
  }

}
