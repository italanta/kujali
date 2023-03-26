import { CrmObject } from '@volk/model/crm/crm-object';

export interface Opportunity extends CrmObject{

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