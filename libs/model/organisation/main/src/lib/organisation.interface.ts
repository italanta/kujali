import { IObject } from '@iote/bricks';

import { KuUser } from '@app/model/common/user';
import { FAccount } from '@app/model/finance/accounts/main';

import { Address } from './address.interface';
import { Contact } from './contact.interface';

export interface Organisation extends IObject
{
  logoUrl?: string;

  name: string;

  kboNumber?: string;

  address?: Address;
  contact?: Contact;

  email: string;
  phone: string;
  website: string;

  bankingInfo : OrgBankingInfo;

  activatedBankAccount?: number;

  users: string[],
  activeUser?: KuUser;

  roles: string[];
  permissions: {};

  vatNo: string;
}

export interface OrgBankingInfo
{
  accounts: {
    working?: FAccount;
    savings?: FAccount;
    reserve?: FAccount;
  }

  subscriptionStatus?: 'active' | 'overdue' | 'cancelled' | '';
}
