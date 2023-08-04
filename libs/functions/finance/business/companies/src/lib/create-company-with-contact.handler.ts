import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';

export class CreateCompanyWithContactHandler extends FunctionHandler<any, boolean> {

  public async execute(companyData: any, context: FunctionContext, tools: HandlerTools) 
  {
    const contactsRepo = tools.getRepository<any>(`orgs/${companyData.orgId}/contacts`);
    const companyRepo = tools.getRepository<any>(`orgs/${companyData.orgId}/companies`);

    let companyId = '';
    let contactData = companyData.companyDetails.contactDetails;

    try {
      let companyObj: Company = {
        name: companyData.companyDetails.name,
        hq: companyData.companyDetails.hq,
        email: '',
        phone: '',
        accManager: [],
        vatNo: '',
        facebook: '',
        linkedin: '',
        tags: companyData.companyDetails.tags ?? [],
        restricted: false,
        accessibleBy: []
      }
  
      let company =  await companyRepo.create(companyObj as Company);
      companyId = company.id;
      
      contactData.company = companyId;

      let contactObj : Contact = {
        fName: contactData.fName,
        lName: contactData.lName,
        address: '',
        phone: contactData.phone ?? '',
        email: contactData.email ?? '',
        company: contactData.company ?? '',
        role: contactData.role ?? [],
        gender: contactData.gender ?? "",
        mainLanguage: contactData.mainLanguage ?? "",
        tags: [],
        dob: '',
        facebook: '',
        linkedin: '',
        restricted: false,
        accessibleBy: []
      }

      contactsRepo.create(contactObj as Contact);

      return true

    } catch (error) {
      tools.Logger.log(() => `Error creating company and contact ${error}`);
      return false
    }
  }
}
