import NoteType from './note-type';

export type Note = {
  id: string;
  type: NoteType;
  name: string;
  taskTime: null;
  taskEndTime: null;
  notificationId: null;
  description: string;
  taskPoints: null;
  members: null;
  creationTime: number;
  updateTime: number;
};
