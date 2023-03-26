import { IObject } from "@iote/bricks";

export interface OpportunityTypes extends IObject{
  labels: TypeLabel[];
}

export interface TypeLabel {
  label: string;
  color: string;
}