import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';
import { Opportunity } from '@app/model/finance/opportunities';

export class CreateOppsWithContactOrCompanyHandler extends FunctionHandler<any, boolean> {
  public async execute(oppsData: any, context: FunctionContext, tools: HandlerTools) {
    
    const contactsRepo = tools.getRepository<any>(
      `orgs/${oppsData.orgId}/contacts`
    );
    const companyRepo = tools.getRepository<any>(
      `orgs/${oppsData.orgId}/companies`
    );
    const oppsRepo = tools.getRepository<any>(
      `orgs/${oppsData.orgId}/opportunities`
    );

    let contactId = '';
    let companyId = '';

    if (oppsData.contact != '') {
      try {
        let contactData: Contact = {
          fName: oppsData.contact.fName,
          lName: oppsData.contact.lName,
          address: '',
          phone: oppsData.contact.phone ?? '',
          email: oppsData.contact.email ?? '',
          role: oppsData.contact.role ?? [],
          tags: oppsData.contact.tags ?? [],
          facebook: '',
          linkedin: '',
          gender: '',
          mainLanguage: '',
          dob: '',
          restricted: false,
          accessibleBy: [],
        };

        let contact = await contactsRepo.create(contactData as Contact);
        contactId = contact.id;
      } catch (error) {
        tools.Logger.log(() => `Error creating contact ${error}`);
      }
    }

    if (oppsData.company != '') {
      try {
        let companyData: Company = {
          name: oppsData.company.name,
          logoImgUrl: '',
          phone: '',
          accManager: [],
          vatNo: '',
          hq: oppsData.company.hq,
          tags: [],
          email: '',
          facebook: '',
          linkedin: '',
          restricted: false,
          accessibleBy: [],
        };

        let company = await companyRepo.create(companyData as Company);
        companyId = company.id;
      } catch (error) {
        tools.Logger.log(() => `Error creating company ${error}`);
      }
    }

    try {
      oppsData.opps.contact = contactId;
      oppsData.opps.company = companyId;

      oppsRepo.create(oppsData.opps as Opportunity);

    } catch (error) {
      tools.Logger.log(() => `Error creating opportunity ${error}`);
      return false
    }

    return true;
  }
}
