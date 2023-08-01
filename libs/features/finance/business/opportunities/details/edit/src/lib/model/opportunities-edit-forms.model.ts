import { FormBuilder } from "@angular/forms";
import { Timestamp } from "@firebase/firestore-types";
import { Opportunity } from "@app/model/finance/opportunities";

export function CreateOpportunityForm (_fb: FormBuilder){
  return _fb.group({
    id: [''],
    title: [''],
    type: [''],
    desc: [''],
    company: [''],
    contact: [''],
    deadline: [''],
    assignTo: [[]],
    status: [''],
    tags: [[]],
    restricted: [false],
    accessibleBy: [[]],
  });
}

export function PatchOpportunityForm (_fb: FormBuilder, opps:Opportunity){
  return _fb.group({
    id: [opps.id ?? ''],
    title: [opps.title ?? ''],
    type: [opps.type ?? ''],
    desc: [opps.desc ?? ''],
    company: [opps.company ?? ''],
    contact: [opps.contact ?? ''],
    deadline: [getDate(opps.deadline)],
    assignTo: [opps.assignTo ?? []],
    status: [opps.status ?? ''],
    tags: [opps.tags ?? []],
    restricted: [opps.restricted ?? false],
    accessibleBy: [opps.accessibleBy ?? []],
  });
}

function getDate(date: Timestamp) {
  if (date) {
    return new Date(date.seconds * 1000);
  }
  return ''
}