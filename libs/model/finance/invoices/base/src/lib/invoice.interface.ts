import { Timestamp } from '@firebase/firestore-types';

import { CrmObject } from '@volk/model/crm/crm-object';

export interface Invoice extends CrmObject {

  title: string

  customer: string
  company: string
  contact: string

  date: Timestamp | string
  dueDate: Timestamp | string
  
  status: string;
  number: string

  products: []

  currency: string

  structuredMessage: string
}
