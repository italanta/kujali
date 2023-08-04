import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetsStore } from '@app/state/finance/budgetting/budgets';

@Component({
  selector: 'app-manage-budget-access',
  templateUrl: './manage-budget-access.component.html',
  styleUrls: ['./manage-budget-access.component.scss'],
})
export class ManageBudgetAccessComponent implements OnInit {

  budgetAccessForm: FormGroup;

  updatingPermissions = false;

  constructor(private _dialog: MatDialog,
              private _budgets$$: BudgetsStore,
              @Inject(MAT_DIALOG_DATA) public data: Budget
    )
  {
    this.budgetAccessForm = new FormGroup({
      restricted: new FormControl(false),
      accessibleBy: new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.budgetAccessForm.patchValue({
      restricted: this.data.restricted,
      accessibleBy: this.data.accessibleBy,
    });
  }

  updateBudget() {
    this.updatingPermissions = true;

    this.data.restricted = this.budgetAccessForm.get('restricted')?.value;
    this.data.accessibleBy = this.budgetAccessForm.get('accessibleBy')?.value;

    this._budgets$$.update(this.data).subscribe(() => {
      this.updatingPermissions = false;
      this._dialog.closeAll();
    });
  }
}
