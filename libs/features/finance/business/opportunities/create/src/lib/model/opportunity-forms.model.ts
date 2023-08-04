import * as moment from "moment";
import { FormBuilder, Validators } from "@angular/forms";

import { _PhoneOrEmailValidator } from "@app/elements/forms/validators";

export function __CreateOpportunityForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      title: ['', Validators.required],
      type: ['', Validators.required],
      desc: ['', Validators.required],
      deadline: [moment()],
      assignTo: [[]],
      company: [],
      contact: [],
      status: [''],
      tags: [],
      restricted: [false],
      accessibleBy: [[]],
    },
    {}
  );
}

export function __CreateContactForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      contact: [''],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      email: [''],
      phone: [''],
    },
    { validators: _PhoneOrEmailValidator('phone', 'email') }
  );
}

export function __CreateCompanyForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      company: [''],
      name: ['', Validators.required],
      hq: ['', Validators.required],
    }
  );
}
