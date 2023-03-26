
import { IObject } from "@iote/bricks"
import { KuUserRoles } from "@app/model/common/user"

export interface KujaliPermissions extends IObject
{
  access: boolean,

  GeneralSettings: {
    CanAddNewMember: KujaliFeaturePermission,
    CanDeleteMember: KujaliFeaturePermission,
  },
  CompanySettings: {
    CanViewCompanies: KujaliFeaturePermission,
    CanCreateCompanies: KujaliFeaturePermission,
    CanEditCompanies: KujaliFeaturePermission,
    CanEditCompanyActions: KujaliFeaturePermission,
    CanDeleteCompanies: KujaliFeaturePermission,
    CanViewCompanyActions: KujaliFeaturePermission,
    CanCreateCompanyActions: KujaliFeaturePermission,
    CanDeleteCompanyActions: KujaliFeaturePermission
  },
  ContactsSettings: {
    CanViewContacts: KujaliFeaturePermission,
    CanCreateContacts: KujaliFeaturePermission,
    CanEditContacts: KujaliFeaturePermission,
    CanEditContactActions: KujaliFeaturePermission,
    CanDeleteContacts: KujaliFeaturePermission,
    CanViewContactsActions: KujaliFeaturePermission,
    CanCreateContactsActions: KujaliFeaturePermission,
    CanDeleteContactsActions: KujaliFeaturePermission
  },
  OpportunitiesSettings: {
    CanViewOpportunities: KujaliFeaturePermission,
    CanCreateOpportunities: KujaliFeaturePermission,
    CanEditOpportunities: KujaliFeaturePermission,
    CanEditOpportunitiesActions: KujaliFeaturePermission,
    CanDeleteOpportunities: KujaliFeaturePermission,
    CanViewOpportunitiesActions: KujaliFeaturePermission,
    CanCreateOpportunitiesActions: KujaliFeaturePermission,
    CanDeleteOpportunitiesActions: KujaliFeaturePermission
  },
  InvoicesSettings: {
    CanViewInvoices: KujaliFeaturePermission,
    CanCreateInvoices: KujaliFeaturePermission,
    CanEditInvoices: KujaliFeaturePermission,
    CanDeleteInvoices: KujaliFeaturePermission,
    CanSendInvoice: KujaliFeaturePermission
  },
  QuotesSettings: {
    CanViewQuotes: KujaliFeaturePermission,
    CanCreateQuotes: KujaliFeaturePermission,
    CanEditQuotes: KujaliFeaturePermission,
    CanSendQuotes: KujaliFeaturePermission,
    CanDeleteQuotes: KujaliFeaturePermission,
  },
  OrdersSettings: {
    CanViewOrders: KujaliFeaturePermission,
    CanEditOrders: KujaliFeaturePermission,
    CanCreateOrders: KujaliFeaturePermission,
    CanDeleteOrders: KujaliFeaturePermission,
  }
}

/** Permission setting on a single feature/claim/.. */
export interface KujaliFeaturePermission extends KuUserRoles {}