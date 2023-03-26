import { financeObject } from '@app/model/finance/finance-object';

export interface OpportunityTypes extends financeObject{
  labels: TypeLabel[];
}

export interface TypeLabel {
  label: string;
  color: string;
}