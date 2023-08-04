import { IObject } from "@iote/bricks";

import { DataAccessRestriction } from "@app/model/access-control";

export interface Opportunity extends DataAccessRestriction, IObject{

  title: string,
  type: string,

  desc: string,

  company: string,
  contact: string,
  
  deadline: any,
  assignTo: string[],

  status: string,

  tags: string[],
}