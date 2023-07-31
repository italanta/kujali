import { FormBuilder, FormGroup } from "@angular/forms";

export function CreateNewBankAccountForm (_fb: FormBuilder): FormGroup {
  return _fb.group({
    name: [''],
    desc: [''],
    accountHolder: [''],
    accountHolderPhone: [''],
    accountHolderEmail: [''],
    iban: [''],
    bic: [''],
    currency: [''],

    // accountHolderAddress: _fb.group({
    //   city: [''],
    //   country: [''],
    //   streetName: [''],
    //   physicalAddress: [''],
    //   postalAddress: [''],
    //   postalCode: [''],
    // }),

    bankConnection : [0],
    trType: ['bank'],
    restricted: [false],
    accessibleBy: [[]],
  })
}