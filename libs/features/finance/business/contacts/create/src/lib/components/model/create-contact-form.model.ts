import { FormBuilder, FormControl, Validators } from "@angular/forms";

import { _PhoneOrEmailValidator } from "@app/elements/forms/validators";

export function CREATE_CONTACT_FORM (_fb: FormBuilder) {
  return _fb.group(
    {
      fName: new FormControl('', [Validators.required]),
      lName: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      email: new FormControl(''),
      company: new FormControl(''),
      role: new FormControl(),
      tags: new FormControl(),
      gender: new FormControl(''),
      mainLanguage: new FormControl(''),
      address: new FormControl(''),
      facebook: new FormControl(''),
      linkedin: new FormControl(''),
      dob: new FormControl(''),
      restricted: new FormControl(false),
      accessibleBy: new FormControl([]),
    },
    {
      updateOn: 'submit',
      validators: _PhoneOrEmailValidator('phone', 'email'),
    }
  );
}