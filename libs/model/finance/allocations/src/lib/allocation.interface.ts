import { IObject } from '@iote/bricks';

/** Allocation model.
 *  Acts as the link between an invoice and a payment */
export interface Allocation extends IObject
{
  /** Id of the invoice being reconciled. */
  req: string;
  /** Id of the payment/credit note reconciling with req  i*/
  tr: string;

  trType: AllocateWithType;
  // /** Id of the account where the payment is stored/originated from */
  // pmtAccId?: string;

  /** In case only a partial amount is reconciled between a payment and trRequest
   *    - Helps track how reconciliation was done.
   * This is for explicit partial allocation.
   * If req or tr is higher/lower as the other and there is no explicit allocation, reconcile will always be partial. */
  amount?: number;
}

/**
 * Type with which we are allocating.
 *
 * - Can be either a payment or an invoice of the opposite mode.
 */
export enum AllocateWithType
{
  /** Simplest case, a payment/cash transaction. */
  Payment = 1,

  /** Invoice with same supplier and reverse mode of the primary invoice */
  Invoice = 2,

  /**Internal Transfer alloc */
  InternalTransfers = 4,

  /** Credit that is the result of a past allocation. */
  AllocCredit = 9
}
