import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessControlMainService } from './services/access-control-main.service';

//base actions
import { PerformActionRightsQuery } from './queries/base/perfom-action-rights.query';
import { PerformAdminActionRightsQuery } from './queries/base/perfom-admin-actions-rights.query';
import { PerformSuperAdminActionRightsQuery } from './queries/base/perfom-super-admin-actions-rights.query';

//role actions
import { PerformSeniorActionRightsQuery } from './queries/base/perfom-senior-actions-rights.query';
import { PerformJuniorActionRightsQuery } from './queries/base/perfom-junior-actions-rights.query';
import { PerformInternActionRightsQuery } from './queries/base/perfom-intern-actions-rights.query';

//domain actions
import { PerformCompanyActionRightsQuery } from './queries/companies/perfom-company-actions-rights.query';
import { PerformContactsActionRightsQuery } from './queries/contacts/perfom-contact-actions-rights.query';
import { PerformOpportunitiesActionRightsQuery } from './queries/opportunities/perfom-opportunities-actions-rights.query';
import { PerformInvoicesActionRightsQuery } from './queries/invoices/perfom-invoices-actions-rights.query';
import { PerformSettingsActionRightsQuery } from './queries/settings/perfom-settings-actions-rights.query';
import { PerformCreateKujaliMembersActionRightsQuery } from './queries/base/perfom-create-kujali-member-actions.query';
import { PerformCreateCompaniesActionRightsQuery } from './queries/companies/perfom-create-companies-actions-rights.query';
import { PerformCreateContactsActionRightsQuery } from './queries/contacts/perfom-create-contacts-actions-rights.query';
import { PerformCreateOpportunitiesActionRightsQuery } from './queries/opportunities/perfom-create-opportunities-actions-rights.query';
import { PerformCreateInvoicesActionRightsQuery } from './queries/invoices/perfom-create-invoices-actions-rights.query';
import { PerformCompaniesActionsViewRightsQuery } from './queries/companies/perfom-companies-actions-view-rights.query';
import { PerformDeleteCompaniesActionRightsQuery } from './queries/companies/perfom-delete-companies-actions-rights.query';
import { PerformDeleteContactsActionRightsQuery } from './queries/contacts/perfom-delete-contacts-actions-rights.query';
import { PerformDeleteOppsActionRightsQuery } from './queries/opportunities/perfom-delete-opportunities-actions-rights.query';
import { PerformDeleteInvoicesActionRightsQuery } from './queries/invoices/perfom-delete-invoices-actions-rights.query';
import { PerformSendInvoicesActionRightsQuery } from './queries/invoices/perfom-send-invoices-actions-rights.query';
import { PerformEditCompaniesActionRightsQuery } from './queries/companies/perfom-edit-companies-actions-rights.query';
import { PerformEditContactsActionRightsQuery } from './queries/contacts/perfom-edit-contacts-actions-rights.query';
import { PerformEditOpportunitiesActionRightsQuery } from './queries/opportunities/perfom-edit-opportunities-actions-rights.query';
import { PerformEditInvoicesActionRightsQuery } from './queries/invoices/perfom-edit-invoices-actions-rights.query';

import { DataAccessQuery } from './base/data-access-query';
import { ActiveDomainLoader } from './base/base-domains/active-domain-loader.service';

@NgModule({
  imports: [CommonModule],
})
export class AccessControlStateModule {
  static forRoot(): ModuleWithProviders<AccessControlStateModule>
  {
    return {
      ngModule: AccessControlStateModule,
      providers: [

        //base data access control
        DataAccessQuery,
        ActiveDomainLoader,

        //members actions rights
        PerformCreateKujaliMembersActionRightsQuery,
        
        //base actions rights
        PerformActionRightsQuery,
        PerformAdminActionRightsQuery,
        PerformSuperAdminActionRightsQuery,

        //role actions
        PerformSeniorActionRightsQuery,
        PerformJuniorActionRightsQuery,
        PerformInternActionRightsQuery,

        //domain actions rights
        PerformContactsActionRightsQuery,
        PerformCompanyActionRightsQuery,
        PerformOpportunitiesActionRightsQuery,
        PerformInvoicesActionRightsQuery,
        PerformSettingsActionRightsQuery,

        //companies Actions Rights
        PerformCreateCompaniesActionRightsQuery,
        PerformCompaniesActionsViewRightsQuery,
        PerformDeleteCompaniesActionRightsQuery,
        PerformEditCompaniesActionRightsQuery,

        //contacts Actions Rights
        PerformCreateContactsActionRightsQuery,
        PerformDeleteContactsActionRightsQuery,
        PerformEditContactsActionRightsQuery,

        //opps actions rights
        PerformCreateOpportunitiesActionRightsQuery,
        PerformDeleteOppsActionRightsQuery,
        PerformEditOpportunitiesActionRightsQuery,

        //invoices actions rights
        PerformCreateInvoicesActionRightsQuery,
        PerformDeleteInvoicesActionRightsQuery,
        PerformSendInvoicesActionRightsQuery,
        PerformEditInvoicesActionRightsQuery,

        { provide: 'IAccessControlService', useClass: AccessControlMainService }
      ]
    }
  }
}
