import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Budget } from '@app/model/finance/planning/budgets';
import { FinancialExplorerStateService } from '@app/state/finance/budgetting/rendering';

@Component({
  selector: 'app-prompt-save-budget-changes',
  templateUrl: './prompt-save-budget-changes.component.html',
  styleUrls: ['./prompt-save-budget-changes.component.scss'],
})

export class PromptSaveBudgetChangesComponent {

  savingBugetChanges: boolean = false;

  savedSuccessfully: boolean = false;

  constructor(private _eXState$$: FinancialExplorerStateService,
              public dialogRef: MatDialogRef<PromptSaveBudgetChangesComponent>){ }

  saveBudgetChanges() {
    this.dialogRef.close({event: 'saveChanges'});
  }

  saveBudgetChangesAndClose() {
    this.savingBugetChanges = true;
    this._eXState$$.submitBudget({} as Budget).subscribe(() => {
      this.savingBugetChanges = false;
      this.savedSuccessfully = true;
      setTimeout(() => this.dialogRef.close({event: 'saveChangesAndClose'}), 1000);
    });
  }
}
