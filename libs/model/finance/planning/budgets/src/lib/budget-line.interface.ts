import { IObject } from "@iote/bricks";

export interface BudgetLine extends IObject{

  // The total amount of the line, for that month.
  amount: number;

  // The unit amount of the line, for that month.
  baseAmount: number;

  // The budgetId that this line belongs to.
  budgetId: string;

  // Whether this line is start of the budget line occurences
  isOccurenceStart: boolean;

  // The lineId that this line belongs to.
  lineId: string;

  // The month that this line is for.
  month: number;

  // The year of the line.
  year: number;

  // The plan/trs (on budget) this line belongs to.
  planId: string;

  // The mode of the plan/trs (on budget) this line belongs to.
  mode?: 1 | -1; 
}