import { IObject } from "@iote/bricks";

export interface InvoicesPrefix extends IObject {
  prefix: string;
  number: number;
  
  extraNote: string;
  termsAndConditionsDocUrl: string;
}