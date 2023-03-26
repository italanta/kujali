import { IObject } from '@iote/bricks';

export interface Company extends IObject {
  name: string;
  email: string;
  logoImgUrl?: string;

  phone: string

  hq: string;
  
  accManager: string[]
  vatNo: string;

  /** List of Tag IDs */
  tags?: string[];

  facebook: string;
  linkedin: string;

  slogan?: string;
  website?: string;
}
