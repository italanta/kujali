import { Injectable } from '@angular/core';

import { SubSink } from 'subsink';

import { Observable} from 'rxjs';

import { Company } from '@app/model/finance/companies';
import { Contact } from '@app/model/finance/contacts';

import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';
import { InvoicesService } from '@app/state/finance/invoices';

import { OperationsBudgetsModel } from '../model/operations-budget.model';

@Injectable({
  providedIn: 'root'
})

export class OperationsBudgetsModelService {

  private _state: OperationsBudgetsModel | null;

  constructor(private _plans$$: BudgetPlansQuery,
              private _invoicesService: InvoicesService,
              private _expServices: ExpensesStateService,
              private _budgetsStateService$$: BudgetsStateService
  ) { }

  initModalState(): OperationsBudgetsModel {
    if (!this._state) {
      const model = new OperationsBudgetsModel(this._plans$$, this._invoicesService, this._expServices, this._budgetsStateService$$);
      this._state = model;
    }
    return this._state as OperationsBudgetsModel;
  }

  getModalState(): OperationsBudgetsModel {
    if (!this._state) throw new Error('[OperationsBudgetsModel] State not initialised.');
    return this._state as OperationsBudgetsModel;
  }

  endModelState = () => {this._state = null};
}
