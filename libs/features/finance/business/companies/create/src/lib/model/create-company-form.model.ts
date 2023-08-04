import { FormBuilder, Validators } from "@angular/forms";
import { _PhoneOrEmailValidator } from "@app/elements/forms/validators";

export function CREATE_COMPANY_FORM(_fb: FormBuilder) {
  return _fb.group(
    {
      name: ['', Validators.required],
      hq: ['', Validators.required],
      logoImgUrl: [''],
      tags: [[]],
      contact: [''],
      contactDetails: _fb.group(
        {
          fName: ['', Validators.required],
          lName: ['', Validators.required],
          email: [''],
          phone: [''],
          company: [''],
        },
        {
          updateOn: 'submit',
          validators: _PhoneOrEmailValidator('phone', 'email'),
        }
      ),
      restricted: [false],
      accessibleBy: [[]],
    },
    { updateOn: 'submit' }
  ); 
}