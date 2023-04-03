import { Timestamp } from '@firebase/firestore-types';

import { IObject } from '@iote/bricks';

/**
 * A single element of allocation information concerning a payment.
 *
 * The allocation element "explains" what the payment was for.
 * This explanation comes in the form of a linked invoice.
 *
 * Note that we only justify this for payments with invoices.
 *
 * The allocation element can be one of many for the same payment, as a payment can pay multiple things.
 */
export interface PaymentAllocationElement extends IObject
{
  /** ID === allocation-ID */
  // id: string;

  /** Foreign key to primary payment ID.
   *  @note A payment can be alloced to multiple artifects (balance clearing).
   *        This means that invoice-alloc ID for elements cannot be the same as payment-id. */
  pId: string;

  /** Transaction ID of allocation fulfill. */
  // trId: string;

  /** Foreign key to originating allocation ID */
  // allocId: string;

  /** PaymentBase note */
  note: string;
  /** PaymentBase date */
  date: Timestamp | Date;

  /** Account ID of the payee. */
  accId: string;
  /** Account name of the payee. */
  accName: string;

  /** invoice being fulfilled. */
  invoiceId: string;
  invoiceTitle: string;

  /** Amount allocated to the invoice. */
  allocAmount: number;
  /** Mode to alloc in. Must match invoice mode. */
  allocMode: 1 | -1;
}
