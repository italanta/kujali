export interface BudgetAnalysisAggregate { 
  tottalIncome: number, 
  tottalCost: number, 
  difference: number, 
  allocatedIncome?: number, 
  allocatedCost?: number 
};

export const DEFAULT_ANALYSIS_AGGREGATE: BudgetAnalysisAggregate = { 
  tottalIncome: 0, 
  tottalCost: 0, 
  difference: 0, 
  allocatedIncome: 0, 
  allocatedCost: 0 
};

export function resetBudgetAnalysisAggregate(): BudgetAnalysisAggregate {
  return DEFAULT_ANALYSIS_AGGREGATE;
}
