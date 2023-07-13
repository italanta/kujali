import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';
import { Budget } from '@app/model/finance/planning/budgets';

const ALL_BUDGET_LINES_REPO = (orgId: string) => `orgs/${orgId}/budget-lines`;

export class PromoteBudgetHandler extends FunctionHandler<any, any>
{
  public async execute(budgetData: { budget: FinancialExplorerState, plans: TransactionPlan[] }, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `[PromoteBudgetHandler].execute: starting to promote budget: ${budgetData.budget.budget.name}`);

    // step 1. get budget & plans & duration
    const budget = budgetData.budget.budget;
    const totalBudgetYears: number[] = budgetData.budget.years;

    // step 2. get all lines (costs & income)
    const allCosts = this.applyfilter(budgetData.budget.scopedCosts, tools);
    const allIncome = this.applyfilter(budgetData.budget.scopedIncome, tools);

    // step 3. merge all lines
    const allPlans = allCosts.concat(allIncome);
    tools.Logger.log(() => `[PromoteBudgetHandler].execute: total plans are ${allPlans.length}`);

    // step 4. set the lines repo
    const linesRepo = tools.getRepository<any>(ALL_BUDGET_LINES_REPO(budget.orgId));

    tools.Logger.log(() => `[PromoteBudgetHandler].execute: Starting writing lines on the db`);

    const updateAllPlans$ = allPlans.map(async (pl) => {

      tools.Logger.log(() => `[PromoteBudgetHandler].execute: Iterating plans ${pl.name}`);

      tools.Logger.log(() => `[PromoteBudgetHandler].execute: iterate through all plan years`);

      const yearWrites$ = totalBudgetYears.map(async (yr) => {

        const yearData = pl.amountsYear.find((ay) => ay.year == yr);

        tools.Logger.log(() => `[PromoteBudgetHandler].execute: set the data for current year Month`);
        const activeMonthData = yearData?.amountsMonth;

        let months$ = activeMonthData?.map(async (month, index) => {
          tools.Logger.log(() => `[PromoteBudgetHandler].execute: creating lines from months amount ${yearData?.year} year, ${index} month`);

          let monthPlan = month['plan']?.id ? month['plan'] : {};

          delete month['plan'];

          month['year'] = yearData?.year ?? 0;
          month['month'] = index + 1;
          month['planId'] = monthPlan.id ?? '';
          month['lineId'] = monthPlan?.lineId ?? '';
          month['budgetId'] = monthPlan?.budgetId ?? '';
          month['allocatedTo'] = '';
          month['mode'] = monthPlan?.mode ?? '';

          const lineId = `${yr}-${index + 1}-${month['lineId']}`;
          await linesRepo.write(month, lineId);
        })

        await Promise.all(months$!);
      })

      await Promise.all(yearWrites$);
    })

    const writePlans$ = await Promise.all(updateAllPlans$);

    // step 5. update budget status
    let trimmedBudget = { ...budget } as Budget;
    delete trimmedBudget['income'];
    delete trimmedBudget['incomeTotals'];
    delete trimmedBudget['costs'];
    delete trimmedBudget['costTotals'];
    delete trimmedBudget['result'];
    delete trimmedBudget['balance'];
    delete trimmedBudget['children'];

    trimmedBudget.status = 1;

    const updateBudget$ = await tools.getRepository<any>(`orgs/${budget.orgId}/budgets`).write(trimmedBudget, trimmedBudget.id!);

    return await Promise.all([writePlans$, updateBudget$]);
  }

  applyfilter(data: BudgetRowYear[], tools: HandlerTools): BudgetRowYear[] {
    tools.Logger.log(() => `[PromoteBudgetHandler].applyfilter: filtering;`);

    return data.filter((row) =>
      row.isHeader === false && (row?.name !== 'BUDGETTING.LINES.COST' && row?.name !== 'BUDGETTING.LINES.INCOME'))
  }
}