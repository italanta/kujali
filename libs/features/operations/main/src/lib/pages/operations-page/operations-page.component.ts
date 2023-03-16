import { Component, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { combineLatest, map, switchMap, take } from 'rxjs';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';

import { ActivatePontoBankingService } from '../../services/activate-ponto-banking.service';
import { MatDialog } from '@angular/material/dialog';
import { SingleActionMessageModalComponent } from 'libs/features/shared/components/modals/src';

@Component({
  selector: 'app-operations-page',
  templateUrl: './operations-page.component.html',
  styleUrls: ['./operations-page.component.scss'],
})
export class OperationsPageComponent implements OnInit {

  private _sbS = new SubSink();

  startPontoOnboarding = false;

  acc: FAccount;
  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts: any;

  hasReserveAccount: boolean = false;
  hasSavingsAccount: boolean = false;
  hasWorkongAccount: boolean = false;

  constructor(private _dialog: MatDialog,
              private __userService: UserService<KuUser>,
              private _bankActivateService: ActivatePontoBankingService,
              private _activeOrg: ActiveOrgStore
  ) {}

  ngOnInit() {
    this.getOrgAndUserDetails();
  }

  getOrgAndUserDetails() {
    this._sbS.sink = combineLatest([this._activeOrg.get(), this.__userService.getUser()]).pipe(take(1)).subscribe(([org, user]) => {
      if (org && user) {
        this.org = org;
        this.accounts = org.bankingInfo.accounts;
        this.hasReserveAccount = org.bankingInfo.accounts.reserve ? true : false;
        this.hasSavingsAccount = org.bankingInfo.accounts.savings ? true : false;
        this.hasWorkongAccount = org.bankingInfo.accounts.working ? true : false;
      }
    })
  }

  connectToPonto(account: string) {
    this.isLoading = true;
    this.startPontoOnboarding = true;

    this.org = this.org;
    this.acc = this.accounts[account];

    let data = { org: this.org, acc: this.acc, isReconnect: false }

    this._sbS.sink = this.__userService.getUser()
                          .pipe(take(1),
                                switchMap((user) => this._bankActivateService.pontocreateOnboardingDetails(this.org, user)),
                                map((res) => { console.log(res);
                                 return this._bankActivateService.pontoConstructRedirectLink(data, this.org, this.acc,res)}))
                          .subscribe(url => {
                            this.redirectUrl = url;                                            
                            this.openPontoDialog();
                            this.isLoading = false;
                          });
  }

  openPontoDialog() {
    this._dialog.open(SingleActionMessageModalComponent, {
      data: {
        dialogTitle: 'Finish setup on Ponto',
        actionMessage: 'Click the button below to finish setting up your Ponto account.',
        actionUrl: this.redirectUrl,
      },
    });
  }

}