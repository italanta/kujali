import { Injectable } from '@angular/core';
import { KujaliFeaturePermission, KujaliPermissions } from '@app/model/organisation';

import { PermissionsStateService } from '@app/state/organisation';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionsService {

  constructor(private _permissionsService: PermissionsStateService) { }

  checkActionsPermissions() {
    return this._permissionsService.checkAccessRight((p: KujaliPermissions) => p.ExpensesSettings.CanViewExpensesActions);
  }

  checkOppsPermissions() {
    return this._permissionsService.checkAccessRight((p: KujaliPermissions) => p.OpportunitiesSettings.CanViewOpportunities);
  }

  checkInvoicesPermissions() {
    return this._permissionsService.checkAccessRight((p: KujaliPermissions) => p.InvoicesSettings.CanViewInvoices);
  }
}