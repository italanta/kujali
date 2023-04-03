import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';
import { InvoiceAllocation } from './invoice-allocation.interface';

export interface Invoice extends InvoiceAllocation, IObject {

  title: string

  customer: string
  company: string
  contact: string

  date: Timestamp 
  dueDate: Timestamp
  
  status: string;
  number: string

  products: InvoiceProduct[]

  currency: string

  structuredMessage: string
}

export interface InvoiceProduct {
  cost: number;
  qty: number;
  vat: number;
  discount?: number;
}
