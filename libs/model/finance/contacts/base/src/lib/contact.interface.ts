import { IObject } from "@iote/bricks";

export interface Contact extends IObject {
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
