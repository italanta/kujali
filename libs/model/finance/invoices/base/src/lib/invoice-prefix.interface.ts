import { CrmObject } from '@volk/model/crm/crm-object';

export interface InvoicesPrefix extends CrmObject {
  prefix: string;
  number: number;
  
  extraNote: string;
  termsAndConditionsDocUrl: string;
}