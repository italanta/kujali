import { IObject } from '@iote/bricks';

import { BankConnectionAccountType } from '@app/model/finance/banking';
import { StringLike } from '@firebase/util';
import { DataAccessRestriction } from '@app/model/access-control';

/**
 * Financial Account.
 *
 * Accounts are considered transactable i.e. can perform and receive transactions.
 */
export interface FAccount extends DataAccessRestriction, IObject
{
  name: string;
  desc: String;

  accountHolder: string,
  accountHolderPhone: string,
  accountHolderEmail: string,

  accountHolderAddress?: AccountAddress;

  type: AccountType;
  trType: TransactionType;
  iban?: string;
  bic?: string;

  currency: string,

  /** Child accounts
   *  - Transactions to and from child accounts are calculated in the master account.
   *    Can regress as deep as one wants.
   *    Used by for example owners and suppliers that can transact over multiple accounts.
   */
  accounts?: FAccount[];

  bankConnection?: BankConnectionAccountType;

}
export interface AccountAddress {
  city: string,
  country: string,
  streetName: string,
  physicalAddress: string,
  postalAddress: string,
  postalCode: string,
}
export interface AccountOptions {
  savings: FAccount;
  currents: FAccount;
}

export enum BankAccount {
  savings, currents
}

export enum AccountType {}

export type TransactionType = 'cash' | 'bank';