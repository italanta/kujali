import { financeObject } from '@app/model/finance/finance-object';

export interface Opportunity extends financeObject{

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