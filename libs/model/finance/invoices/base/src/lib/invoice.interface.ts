import { Timestamp } from '@firebase/firestore-types';

import { financeObject } from '@app/model/finance/finance-object';

export interface Invoice extends financeObject {

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
