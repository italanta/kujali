import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { sortBy as __sortBy } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { Role } from '@app/model/roles';
import { ContactRolesStore } from '@app/state/roles';


@Component({
  selector: 'roles-form-field',
  templateUrl: './roles-form-field.component.html',
  styleUrls: ['./roles-form-field.component.scss']
})

export class RolesFormFieldComponent implements OnInit {

  private _sbS = new SubSink();

  roles: FormControl = new FormControl([], Validators.required);

  role$: Observable<Role[]>;

  rolesList: Role[];
  filteredRoles: any;

  addRole = false;

  addRoleFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _roles$$: ContactRolesStore,
              private _translateService: TranslateService
  ) { }

  ngOnInit(): void {

    this.buildRoleForm()

    this.role$ = this._roles$$.get()
    this._sbS.sink = this.role$.subscribe((roles) => {
      this.rolesList = __sortBy(roles, ['id']);
      this.filteredRoles = this.rolesList.slice();
    });
  }

  translTe(text) {
    return this._translateService.translate(text)
  }

  addNewRole() {
    this.addRoleFormGroup.value.label = 'CONTACT.ROLES.' + this.addRoleFormGroup.value.id.toUpperCase()

    this._sbS.sink = this._roles$$
      .add(this.addRoleFormGroup.value as Role, this.addRoleFormGroup.value.id)
      .subscribe((c) => {
        this.roles.setValue([
          ...this.roles.value,
          this.addRoleFormGroup.value.id,
        ]);
        this.toogleAddRole();
        this.addRoleFormGroup.reset();
      });
  }

  buildRoleForm() {
    this.addRoleFormGroup = this._fb.group({
      id: new FormControl(),
      label: new FormControl('')
    })
  }

  toogleAddRole() {
    this.addRole = !this.addRole
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}