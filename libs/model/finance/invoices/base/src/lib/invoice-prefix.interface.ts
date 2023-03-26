import { financeObject } from '@app/model/finance/finance-object';

export interface InvoicesPrefix extends financeObject {
  prefix: string;
  number: number;
  
  extraNote: string;
  termsAndConditionsDocUrl: string;
}