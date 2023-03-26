import { Timestamp } from '@firebase/firestore-types';

import { IObject } from "@iote/bricks";

export interface Activity extends IObject
{
  activityOwnerId: string;
  domainId: string;

  title: string;
  desc: string;

  startDate: Timestamp;
  endDate: Timestamp;

  type: string;

  assignTo: string[];

  completed: boolean;
}