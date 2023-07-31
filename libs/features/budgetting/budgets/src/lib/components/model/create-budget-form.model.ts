import { FormBuilder } from "@angular/forms";

export function CREATE_BUDGET_FORM (_fb: FormBuilder) {
  return _fb.group({
    budgetName: [''],
    startYear: [new Date().getFullYear()],
    duration: [5],
    hasChild: [false],

    restricted: [false],
    accessibleBy: [[]],
  });
}