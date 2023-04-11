import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { ArtifactAllocationStatus } from './allocation-artifact-status.interface';

import { InvoiceAllocationElement } from './invoice-allocation-element.interface';

export interface InvoiceAllocation extends IObject {

   /** Transaction type of allocation-fulfill. */

   /** ID of the alloc trs object. */
   allocId: string;

   elements: InvoiceAllocationElement[];

   allocStatus: ArtifactAllocationStatus;

   /**Account Id is required for updating the unallocated invoice
    * once an allocation has been done.
    */
   to: string;

   toAccName: string;

   /**The amount of money requested on the invoice
    * is necessary for UI display
    */
   amount: number;

   notes: string;

   from: string;

   fromAccName: string;

   date: Timestamp | Date;

   /** In case a balance remains/is underpaid. */
   balance?: number;
   /** In case the balance is overpaid */
   credit?: number;

   mode?: 1 | -1;

   dateReceived?: Timestamp | Date;

   structuredReference?: string;
}