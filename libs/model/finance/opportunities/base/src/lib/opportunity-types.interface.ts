import { CrmObject } from '@volk/model/crm/crm-object';

export interface OpportunityTypes extends CrmObject{
  labels: TypeLabel[];
}

export interface TypeLabel {
  label: string;
  color: string;
}