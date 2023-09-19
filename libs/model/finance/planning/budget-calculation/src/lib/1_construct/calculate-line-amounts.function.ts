import { sortBy as ___sortBy, uniqueId } from 'lodash';

import { Budget } from "@app/model/finance/planning/budgets";

import { TransactionPlan } from "@app/model/finance/planning/budget-items";

import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { AmountPerYear } from "@app/model/finance/planning/budget-lines";

import { NULL_AMOUNT_BY_YEAR_AND_MONTH } from "@app/model/finance/planning/budget-defaults";

import { BudgetLineRow } from '@app/model/finance/planning/budget-rendering';

import { __CalculateAmountForMonth } from './calculate-month-amounts.function';

/**
 * Algorithm which calculates the P&L amounts for a series of years for a given budget line configuration
 * 
 * @param budget - The local budget on which this line shall reside
 * @param occs   - The occurences to plan
 * 
 * For original design (2018) - @see https://gitlab.com/elewa/elewa-portal/-/blob/43c86d549a1dc53a8f9caedfde8e48390de92adc/src/modules/management/modules/financial-plan-explorer/service/base-calculation/pl-amount-calculator.service.ts
 */
export function __CalculateLineAmounts(budget: Budget, occs: TransactionPlan[]) : BudgetLineRow
{
  // Get the template from which to calculate the amounts.
  const valueTemplate = NULL_AMOUNT_BY_YEAR_AND_MONTH(budget.startYear, budget.duration);
  const values = _populateBudgetLineValues(valueTemplate, occs);

  // Use first occurence created as template for the line configuration (category, ...)
  let lineTemplate = occs.find(o => o.king);

  // TODO: Review Jente <> Ian
  if(!lineTemplate)
    throw new Error('Line has no king/main template plan');

  return _templateToLine(lineTemplate, occs, values);
}

/** Algorithm responsible for calculating the value of each column in the whole budget line (accross all its years) */
function _populateBudgetLineValues(line: AmountPerYear[], plans: TransactionPlan[])
{
  const orderedPlans = ___sortBy(plans, ['fromYear', 'fromMonth']);

  // Deep for-loop which iterates and calculates the values of each month.

  // 1. Iterate the years
  for(let yearIdx = 0; yearIdx < line.length; yearIdx++)
  {
    const year = line[yearIdx];

    // 2. Iterate the months of each year
    for(let monthIdx = 0; monthIdx < year.amountsMonth.length; monthIdx++)
    {
      year.amountsMonth[monthIdx] = __CalculateAmountForMonth(year.year, monthIdx, orderedPlans);
    }
  }

  return line;
}

/** Converts the first occurence of all transaciton occurences into a budget line. */
function _templateToLine(template: TransactionPlan, plans: TransactionPlan[], values: AmountPerYear[]): BudgetLineRow
{
  return {
    id: template.id!,
    name: template.lineName,

    amountsYear: _calculateAmountForMonthTotal(values),

    trTypeId: template.trTypeId,
    categoryId: template.trCatId,

    type: template.mode === 1 ? BudgetRowType.IncomeLine : BudgetRowType.CostLine,
    config: template,

    plans,
    isRecord: true,
    total: values.reduce((py, cy) => py + cy.amountsMonth.reduce((pm, cm) => pm + cm.amount, 0), 0)
  }
}

// calculate total for all amountMonths in amountPerYear
function _calculateAmountForMonthTotal(values: AmountPerYear[]) {
  const total = values.map((year) => {
    return {
    ...year,
    total : year.amountsMonth.reduce((prev, curr) => prev + curr.amount, 0)}
  });
  return total;
}
