import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { AllocateWithType } from '@app/model/finance/allocations';

/**
 * A single element of allocation information concerning an invoice.
 *
 *  - The allocation element "explains" how the invoice has been paid.
 *    This explanation comes in the form of a linked payment, or in some cases a linked invoice of opposite mode.
 *
 *  - The allocation element can be one of many for the same invoice, as the invoice can be paid in bits.
 */
export interface InvoiceAllocationElement extends IObject
{
  /**
   * ID === allocation-ID, if InvoiceAllocation is primary allocation.
   * ID === `min_${allocation-ID}, if InvoiceAllocation is a counter allocation. This is only the case when an
   *                                invoice is reconciled against a credit note. The alloc will spawn two invoice-allocs
   *                                with credit note the negative (min) of the invoice alloc*/
  id: string;

  /** Foreign key to primary invoice ID.
   *  @note An invoice can be alloced to multiple payments (payment in installment).
   *        This means that invoice-alloc ID for elements cannot be the same as invoice-id. */
  invId: string;

  /** Transaction ID of allocation fulfill. */
  trId: string;
  /** Transaction type of allocation-fulfill. */
  allocType: AllocateWithType;

  /** Foreign key to originating allocation ID */
  allocId: string;

  /** Account ID of the payee. */
  accId: string;
  /** Account name of the payee. */
  accName: string;

  notes: string;

  date: Timestamp | Date;

  /** Amount allocated to the invoice. */
  allocAmount: number;

  /** Mode to alloc in. Must be opposite of invoice mode if credit, must be the same if payment. */
  allocMode: 1 | -1;

  /**Date in which a payment is done that leads to creation of invoice alloc element */
  paymentDate?: Date | Timestamp;

  /** Structured reference related to invoice/payment related to invoiceAlloc element */
  structuredReference?: string;
}
