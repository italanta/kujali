import { FormBuilder, FormGroup } from "@angular/forms";

import * as moment from "moment";

export function CREATE_PAYMENTS_FORM (_fb: FormBuilder): FormGroup {
  return _fb.group({
    amount: [0],
    date: [moment()],
    note: [''],
    customer: [''],
    invoice: [[]],
    platform: [{name: 'Cash', value: 5}]
  })
}