import NoteType from './note-type';

export type Notion = {
  id: string;
  type: NoteType;
  name: string;
  description: string;
  taskTime: Date;
  taskEndTime: null;
  notificationId: string | null;
  taskPoints: null;
  members: null;
  creationTime: number;
  updateTime: number;
};
