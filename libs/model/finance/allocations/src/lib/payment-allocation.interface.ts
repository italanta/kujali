import { IObject } from '@iote/bricks';

import { ArtifactAllocationStatus } from '@app/model/finance/allocations';
import { PaymentAllocationElement } from './payment-allocation-element.interface';

/**
 * Allocation information concerning a payment.
 *
 *  - The allocation "explains" what the money was used for.
 *    This explanation comes in the form of a linked invoice(s).
 *
 * There can only be one allocation per payment.
 * The allocation is the aggregate of one or many allocation elements.
 */
export interface PaymentAllocation extends IObject
{
  /* ID of the payment being reconciled. */
  id: string;

  /** Transaction type of allocation-fulfill. */
  elements: PaymentAllocationElement[];

  allocStatus: ArtifactAllocationStatus;

  /** In case a balance remains/is underpaid. */
  balance?: number;
  /** In case the balance is overpaid */
  credit?: number;
}