import { IObject } from "@iote/bricks";

import { DataAccessRestriction } from "@app/model/access-control";

export interface Contact extends DataAccessRestriction, IObject {
  id?: string

  logoImgUrl?: string;


  fName: string;
  lName: string;

  phone: string

  email: string;

  company?: string;
  role: string[];

  /** List of Tag IDs */
  tags?: string[];

  gender: string;
  mainLanguage: string;
  address?: string;

  facebook?: string;
  linkedin?: string;

  dob?: any
}
