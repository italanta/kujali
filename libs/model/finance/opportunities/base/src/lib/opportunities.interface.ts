import { IObject } from "@iote/bricks";

export interface Opportunity extends IObject{

  title: string,
  type: string,

  desc: string,

  company: string,
  contact: string,
  
  deadline: any,
  assignTo: string[],

  status: string,

  tags: string[]
  
}