import { DataAccessRestriction } from "@app/model/access-control";
import { Timestamp } from "@firebase/firestore-types";

import { IObject } from "@iote/bricks";

export interface Expenses extends DataAccessRestriction, IObject {
  // Name of the expense
  name: string;
  // The amount of the expense.
  amount: number;

  // The budgetId that this expense belongs to.
  budgetId: string;

  // Transaction this expense belongs to.
  planId: string;

  // The lineId that this expense belongs to.
  lineId?: string;

  // Date for the expense
  date: Timestamp

  // vat number
  vat: number;

  // Extra expense information
  note: string

  // has a budget line been allocated to this expense
  allocated?: boolean;
}