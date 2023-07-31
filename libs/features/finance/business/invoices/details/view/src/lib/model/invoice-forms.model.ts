import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";


export function __CreateInvoiceMainForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      title           : [''],
      date            : [moment()],
      dueDate         : [moment().add(30, 'days')],
      number          : '',
      status          : ['new'],
      products : _fb.array([]),
      structuredMessage: [''],
      currency: ['EUR'],
      restricted: [false],
      accessibleBy: [[]],
    },
  );
}

export function __CreateCompanyForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      id       : [''],
      name     : [''],
      logo     : [''],
      address  : [''],
      vatNo      : [''],
      email    : [''],
      phone    : [''],
      bankAccounts: [[]]
    },
    {}
  );
}

export function __CreateCustomerForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      id       : [''],
      name     : ['', Validators.required],
      logo     : [''],
      contact  : [''],
      address  : [{value: '', disabled: true}],
      vat      : [{value: '', disabled: true}],
      email    : [{value: '', disabled: true}],
      phone    : [{value: '', disabled: true}]
    }
  );
}