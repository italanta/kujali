import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

export interface Invoice extends IObject {

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
