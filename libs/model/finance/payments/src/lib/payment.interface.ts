import { Timestamp } from '@firebase/firestore-types';

import { FTransaction } from './transactions/f-transaction.interface';

/**
 * A payment. A transaction going from source A to B.
 * 
 * Extended with certain info such as beneficiary etc.
 */
export interface Payment extends PaymentBase {
  mode: 1 | -1;
}

/**
 * Base layer for payments. A transaction going from source A to B.
 */
export interface PaymentBase extends FTransaction {
  verified: boolean;

  withIban?: string;

  verificationDate?: Timestamp;

  /** Optional: List of transaction requests (provisions / payments)
   *              this payment covers. */
  for?: string[];

  /**
   * The origin of the payment: i.e Manual / Swan / Ponto
   */
  source?: PaymentSources;
}


export enum PaymentSources {
  Manual = 0,
  Swan = 1,
  Ponto = 2
}
