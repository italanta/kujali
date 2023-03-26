import { UserProfile } from '@iote/bricks';

export interface KuUserProfile extends UserProfile 
{
  phone: string;

  activeOrg: string;
  orgIds: string[]
  /** Budgets the user has access too. */
  budgets: { 
    [id: string]: { 
      view: boolean, 
      edit: boolean
    } 
  }; 
}
