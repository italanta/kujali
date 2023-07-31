import { BudgetLine, BudgetLinesAllocation } from "@app/model/finance/planning/budgets";
import { BudgetLineAllocUI } from "../model/budget-line-view.interface";

export function combineBudgetLineAndBudgetLineAllocs(budgetLines: BudgetLine[], budgetLineAllocs: BudgetLinesAllocation[]): BudgetLineAllocUI[] {
  return budgetLines.map((bLine) => {
    const allocs = budgetLineAllocs.find((alloc) => alloc.id === bLine.id)! ?? {};
    return { ...bLine, ...allocs };
  });
}