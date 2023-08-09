import { FormBuilder, FormGroup } from "@angular/forms";

import * as moment from "moment";

export function CREATE_EXPENSE_FORM (_fb: FormBuilder, activeExpenseDate: moment.Moment): FormGroup {
  return _fb.group({
    name: [''],
    budget: [''],
    plan: [''],
    date: [activeExpenseDate],
    amount: [0],
    vat: [0],
    note: [''],
    allocated: [false],
    restricted: [false],
    accessibleBy: [[]],
  })
}