import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'o',
  templateUrl: './add-role-field.component.html',
  styleUrls: ['./add-role-field.component.scss']
})
export class AddRoleFieldComponent implements OnInit {

  addRole: boolean;
  addRoleFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
  }

  buildRoleForm() {
    this.addRoleFormGroup = this._fb.group({
      id: new FormControl(),
      label: new FormControl(''),
    })
  }


  addNewRole(){

  }

  toogleAddRole() {
    this.addRole = !this.addRole
  }


}
