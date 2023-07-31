import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';

import { Budget } from '@app/model/finance/planning/budgets';

import { AccountsStateService } from '@app/state/finance/banking';

import { CreateNewBankAccountForm } from '../../providers/create-new-bank-account-form.function';

@Component({
  selector: 'app-create-new-bank-account-modal',
  templateUrl: './create-new-bank-account-modal.component.html',
  styleUrls: ['./create-new-bank-account-modal.component.scss'],
})
export class CreateNewBankAccountModalComponent implements OnInit {

  private _sbS = new SubSink();

  addNewBankAccountFormGroup: FormGroup;

  isCreatingNewBankAccount = false;
  
  constructor(private _fb: FormBuilder,
              private _dialogRef: MatDialogRef<CreateNewBankAccountModalComponent>,
              private _accountsService: AccountsStateService,
  ) {}

  ngOnInit(): void {
    this.addNewBankAccountFormGroup = CreateNewBankAccountForm(this._fb);
  }

  createBankAccount() {    
    this.isCreatingNewBankAccount = true;
    this._sbS.sink = this._accountsService.createNewAccount(this.addNewBankAccountFormGroup.value)
                                          .subscribe(() => this.completeCreateActions());
  }

  completeCreateActions() {
    this.isCreatingNewBankAccount = false;
    this._dialogRef.close();
  }
}
