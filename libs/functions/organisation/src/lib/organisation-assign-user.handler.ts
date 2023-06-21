import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Organisation } from '@app/model/organisation';
import { KuUser } from '@app/model/common/user';

export class OrganisationAssignUserHandler extends FunctionHandler<Organisation, boolean>
{

  public async execute(org: Organisation, context: FunctionContext, tools: HandlerTools) {

    const orgsRepo = tools.getRepository<any>(`orgs`);
    const userRepo = tools.getRepository<any>(`users`);

    const perRepo = tools.getRepository<any>(`orgs/${org.id}/config`);
    const invoicePrefixRepo = tools.getRepository<any>(`orgs/${org.id}/config`);
    const contactsRolesPeop = tools.getRepository<any>(`orgs/${org.id}/contact-roles`);

    const oppsTypesRepo = tools.getRepository<any>(`orgs/${org.id}/config`);

    if (!!org.createdBy) {
      try {
        const activeOrg = {
          id: org.id,
          logoUrl: '',
          name: org.name,
          users: [org.createdBy],
          vatNo: '',
          email: '',
          phone: '',
          address: org.address,
          roles: ['admin', 'junior', 'senior', 'intern'],
          permissions: {}
        } as Organisation;

        orgsRepo.update(activeOrg);

        perRepo.write(this._defaultPermissions(), 'permissions');
        invoicePrefixRepo.write({id: 'invoices-prefix', prefix: 'invoices', number: 0}, 'invoices-prefix');
        oppsTypesRepo.write({id: 'opportunity-types', labels: []}, 'opportunity-types');
        contactsRolesPeop.write({id: 'staff', label: 'staff'}, 'staff');

        let adminUser: KuUser = await userRepo.getDocumentById(org.createdBy);
        let adminRight = {
          admin: true,
          junior: false,
          senior: false,
          intern: false
        };

        adminUser.roles[org.id!] = adminRight;
        adminUser.profile.activeOrg = org.id!;
        adminUser.profile.orgIds.push(org.id!);

        userRepo.write(adminUser, org.createdBy)

        return true;

      } catch (err) {
        tools.Logger.log(() => `Error updating ${err}`)
        return false;
      }
    } else {
      return false
    }
  }

  private _defaultPermissions() {
    let defaultPermissions =  {
      GeneralSettings: {
        CanAddNewMember: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteMember: {admin:true, senior:false, junior:false, intern:false},
        CanViewDetailView: {admin:true, senior:false, junior:false, intern:false},
      },
      CompanySettings: {
        CanViewCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanCreateCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanEditCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanEditCompanyActions: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanViewCompanyActions: {admin:true, senior:false, junior:false, intern:false},
        CanCreateCompanyActions: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteCompanyActions: {admin:true, senior:false, junior:false, intern:false}
      },
      ContactsSettings: {
        CanViewContacts: {admin:true, senior:false, junior:false, intern:false},
        CanCreateContacts: {admin:true, senior:false, junior:false, intern:false},
        CanEditContacts: {admin:true, senior:false, junior:false, intern:false},
        CanEditContactActions: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteContacts: {admin:true, senior:false, junior:false, intern:false},
        CanViewContactsActions: {admin:true, senior:false, junior:false, intern:false},
        CanCreateContactsActions: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteContactsActions: {admin:true, senior:false, junior:false, intern:false}
      },
      OpportunitiesSettings: {
        CanViewOpportunities: {admin:true, senior:false, junior:false, intern:false},
        CanCreateOpportunities: {admin:true, senior:false, junior:false, intern:false},
        CanEditOpportunities: {admin:true, senior:false, junior:false, intern:false},
        CanEditOpportunitiesActions: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteOpportunities: {admin:true, senior:false, junior:false, intern:false},
        CanViewOpportunitiesActions: {admin:true, senior:false, junior:false, intern:false},
        CanCreateOpportunitiesActions: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteOpportunitiesActions: {admin:true, senior:false, junior:false, intern:false}
      },
      InvoicesSettings: {
        CanViewInvoices: {admin:true, senior:false, junior:false, intern:false},
        CanCreateInvoices: {admin:true, senior:false, junior:false, intern:false},
        CanSendInvoice: {admin:true, senior:false, junior:false, intern:false},
        CanEditInvoices: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteInvoices: {admin:true, senior:false, junior:false, intern:false},
      }
    }
    return defaultPermissions;
  }
}