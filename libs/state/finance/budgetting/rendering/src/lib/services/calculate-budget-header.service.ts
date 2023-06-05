import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Budget } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';
import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from '@app/model/finance/planning/budget-calculation';

import { DataProvider } from '@app/state/data/firebase';
import { BudgetHeaderResultStore } from '@app/state/finance/budgetting/budgets';

@Injectable({
  providedIn: 'root'
})
export class CalculateBudgetHeaderService {

  constructor(private _db: DataProvider,
              private _bs: AngularFireFunctions,
              private budgetHeaders$$: BudgetHeaderResultStore
  ) {}

  generateInitialBudgetHeader(budget: Budget) {
    const repo = this._db.getRepo<BudgetHeaderResult>(`orgs/${budget.orgId}/budgets/${budget.id}/headers`);
    const headers = this._createInitialHeaders(budget);

    repo.create(headers, headers.id).subscribe();
  }

  _createInitialHeaders(budget: Budget): BudgetHeaderResult {
    const years = budget.startYear ? Array.from({length: budget.duration}, (v, k) => k + budget.startYear) : [];
    const headers = this.generateEmptyYearValues(years);
    
    const header: BudgetHeaderResult = {
      id: Math.floor(Date.now() / 1000).toString(),
      orgId: budget.orgId,
      name: budget.name,
      budgetId: budget.id!,
      startY: budget.startYear,
      duration: budget.duration,
      headers: headers,
      years: years
    }

    return header;
  }

  generateEmptyYearValues(years: number[]) {
    return years.map((year) => {
      return {[year]: this.generateEmptyMonthValues()};
    });
  }

  generateEmptyMonthValues() {
    return Array.from({length: 12}, (v, k) => 0);
  }

  _bdgtCalculateHeader(budget: Budget, plans: TransactionPlan[]) {
    let budgetData = {budget: budget, plans: plans};
    this._bs.httpsCallable('bdgtCalculateHeaderOnSaveBudget')(budgetData).subscribe();
  }
}
