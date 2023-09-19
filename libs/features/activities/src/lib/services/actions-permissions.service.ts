import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { PermissionsStateService } from '@app/state/organisation';
import { KujaliPermissions } from '@app/model/organisation';

@Injectable({
  providedIn: 'root',
})
export class ActionsPermissionsService {
  constructor(private _permissionsService: PermissionsStateService) {}

  checkCreatePermissions(domain: string) {
    return this._permissionsService.checkAccessRight(
      this.getPermissionsDomain(domain, 'create')
    );
  }

  checkDeletePermissions(domain: string) {
    return this._permissionsService.checkAccessRight(
      this.getPermissionsDomain(domain, 'delete')
    );
  }

  private getPermissionsDomain(_domain: string, action: string): (p: any) => any {
    switch (_domain) {
      case 'companies':
        switch (action) {
          case 'create':
            return (p: KujaliPermissions) => p.CompanySettings.CanCreateCompanyActions;

          case 'delete':
            return (p: KujaliPermissions) => p.CompanySettings.CanDeleteCompanyActions;
          default:
            return () => {};
        }

      case 'contacts':
        switch (action) {
          case 'create':
            return (p: KujaliPermissions) => p.ContactsSettings.CanCreateContactsActions;

          case 'delete':
            return (p: KujaliPermissions) => p.ContactsSettings.CanDeleteContactsActions;

          default:
            return () => {};
        }

      case 'opportunities':
        switch (action) {
          case 'create':
            return (p: KujaliPermissions) =>
              p.OpportunitiesSettings.CanCreateOpportunitiesActions;

          case 'delete':
            return (p: KujaliPermissions) =>
              p.OpportunitiesSettings.CanDeleteOpportunitiesActions;

          default:
            return () => {};
        }

      case 'expenses':
        switch (action) {
          case 'create':
            return (p: KujaliPermissions) =>
              p.ExpensesSettings.CanCreateExpensesActions;

          case 'delete':
            return (p: KujaliPermissions) =>
              p.ExpensesSettings.CanDeleteExpensesActions;

          default:
            return () => {};
        }

      default:
        return () => {};
    }
  }
}
