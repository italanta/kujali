import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';

export class UpdateContactWithCompanyHandler extends FunctionHandler<any, boolean> {
  public async execute(companyData: any, context: FunctionContext, tools: HandlerTools
  ) 
  {
    const contactsRepo = tools.getRepository<any>(`orgs/${companyData.orgId}/contacts`);
    const companyRepo = tools.getRepository<any>(`orgs/${companyData.orgId}/companies`);

    try {
      let contactId = companyData.company.contact;
      let companyId = '';
  
      let companyObj: Company = {
        name: companyData.company.name,
        hq: companyData.company.hq,
        email: '',
        phone: '',
        accManager: [],
        vatNo: '',
        facebook: '',
        linkedin: '',
        tags: companyData.company.tags ?? [],
        restricted: false,
        accessibleBy: []
      }
  
      let company =  await companyRepo.create(companyObj as Company);
      companyId = company.id
  
      let contact: Contact = await contactsRepo.getDocumentById(contactId);
      contact.company = companyId;
  
      contactsRepo.write(contact, contactId);
      
    } catch (error) {
      tools.Logger.log(() => `Error updating ${error}`)
      return false;
    }
    return true;
  }
}
