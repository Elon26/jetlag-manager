import NoteType from './note-type';

export type Meeting = {
  id: string;
  type: NoteType;
  name: string;
  description: string;
  taskTime: Date;
  taskEndTime: Date;
  taskPoints: null;
  notificationId: string | null;
  members: string[];
  creationTime: number;
  updateTime: number;
};
