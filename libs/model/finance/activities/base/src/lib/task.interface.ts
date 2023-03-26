import { Timestamp } from '@firebase/firestore-types';

import { IObject } from "@iote/bricks";

export interface Task extends IObject
{
  title: string;
  desc: string;

  startDate: Timestamp;
  endDate: Timestamp;

  assignTo: string[];

  completed: boolean;
}