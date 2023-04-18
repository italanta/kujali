import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { SubSink } from 'subsink';
import { combineLatest, map, switchMap, take, Observable, tap} from 'rxjs';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { AccountsStateService } from '@app/state/finance/banking';

import { SingleActionMessageModalComponent } from '@app/features/shared/components/modals';

import { CreateNewBankAccountModalComponent } from '../../modals/create-new-bank-account-modal/create-new-bank-account-modal.component';

import { ActivatePontoBankingService } from '../../services/activate-ponto-banking.service';

const DATA: FAccount[] = []

@Component({
  selector: 'app-banking-page',
  templateUrl: './banking-page.component.html',
  styleUrls: ['./banking-page.component.scss'],
})

export class BankingPageComponent implements OnInit, AfterViewInit {

  private _sbS = new SubSink();

  displayedColumns: string[] = ['bankIcon', 'name', 'accountHolder', 'iban', 'bic', 'currency', 'trType', 'bankConnection', 'actions'];

  dataSource = new MatTableDataSource(DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  startPontoOnboarding = false;

  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts$: Observable<FAccount[]>;

  showFilter: boolean = false;

  constructor(private _dialog: MatDialog,
              private _router$$: Router,
              private _cdref: ChangeDetectorRef,
              private __userService: UserService<KuUser>,
              private _activeOrg: ActiveOrgStore,
              private _accontsState: AccountsStateService,
              private _bankActivateService: ActivatePontoBankingService
  ) {}

  ngOnInit() {
    this._sbS.sink = this._accontsState.getFAccounts().subscribe((accounts) => {
      this.dataSource.data = accounts;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this._cdref.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toogleFilter(value: boolean) {
    this.showFilter = value;
  }

  connectToPonto(account: FAccount) {
    this.isLoading = true;
    this.startPontoOnboarding = true;
    this.org = this.org;

    let data = { org: this.org, acc: account, isReconnect: false }

    this._sbS.sink = combineLatest([this._activeOrg.get(), this.__userService.getUser()])
                          .pipe(take(1),
                                tap(([org, user]) => {this.org = org}),
                                switchMap(([org, user]) => this._bankActivateService.pontocreateOnboardingDetails(org, user)),
                                map((res) => this._bankActivateService.pontoConstructRedirectLink(data, this.org, account, res)))
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
        actionMessage: 'Click continue to finish the setup on Ponto',
        actionUrl: this.redirectUrl,
      },
      minWidth: '500px'
    });
  }

  addAnAccount() {
    this._dialog.open(CreateNewBankAccountModalComponent, {minWidth: '700px'})
                .afterClosed().subscribe((res) => {})
  }

  editAccount(account: FAccount) {}
  deleteAccount(account: FAccount) {}

  getBankAccount(bankConnection: number): string {
    switch (bankConnection) {
      case 0:
        return 'Not connected';
      case 1:
        return 'Swan';
      case 2:
        return 'Ponto'
      default:
        return 'Not connected'
    }
  }

  goToDetails(accountId: string) {
    this._router$$.navigate([ 'operations', 'banking', 'accounts', accountId]);
  }
}