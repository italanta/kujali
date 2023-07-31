import { IObject } from "@iote/bricks";

import { BudgetStatus } from "./types/budget-status.enum";
import { DataAccessQuery } from "@app/state/access-control";

/**
 * The @interface {Budget} is a key model within our application.
 * 
 * Budgets allow discovery and finalization of business plans for the organisation,
 *    from which then the accounts can be reconciled.
 */
export interface Budget extends DataAccessQuery, IObject 
{
  name: string;

  /** FK to organisation */
  orgId: string;

  status: BudgetStatus;

  /** Override list can be compared to breadcrumbs, leading up to the earliest budget. Each level up with less priority.
   *    The later in the chain (the later in fact being this budget), the more it overrides the older. */
  overrideList: string[];
  overrideNameList: string[];

  childrenList: string[];

  startYear: number;
  /** [0..11] -> Index representing the month. */
  startMonth: number;
  /** Duration in months */
  duration: number;
}
