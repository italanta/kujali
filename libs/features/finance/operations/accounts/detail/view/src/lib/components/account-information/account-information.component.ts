import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { FAccount } from '@app/model/finance/accounts/main';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss'],
})
export class AccountInformationComponent {

  @Input() activeAccount$: Observable<FAccount>;

  constructor() { }
}
