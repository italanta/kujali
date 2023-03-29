import { IObject } from '@iote/bricks'
import { Timestamp } from '@firebase/firestore-types';

import { FTransactionTypes } from './f-transaction-types.enum';

/** Financial Transaction */
export interface FTransaction extends IObject
{
  /** Transaction Amount */
  amount: number;
  currency?: string;

  date: Timestamp | Date;

  dateReceived?: Timestamp | Date;

  /** From Account - Type FAccount */
  from: string;
  fromAccName: string;

  /** To Account   - Type FAccount */
  to: string;
  toAccName: string;

  notes: string;

  type: FTransactionTypes;

  /** Any additional information to be added.
   * */
  payload?: any;

  for?: string[];

  /** The unique id used to link an incoming payment to an existing provision/invoice.
   * Generated ones use OGM-VCS pattern. i.e: '+++3digits/4digits/5digits+++' = +++(trId)/(lot-number)/(owner-Id)+++
   * @see https://www.europeanpaymentscouncil.eu/sites/default/files/inline-files/Febelfin%20-%20AOS-OGMVCS_1.pdf */
  structuredReference?: string;

  isDraft?: boolean;
}
