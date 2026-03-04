import NoteType from './note-type';
import { TaskPoint } from './task-point';

export type Task = {
  id: string;
  type: NoteType;
  name: string;
  description: null;
  taskPoints: TaskPoint[];
  members: null;
  taskTime: Date;
  taskEndTime: null;
  notificationId: string | null;
  creationTime: number;
  updateTime: number;
};
