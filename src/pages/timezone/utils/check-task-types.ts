import { Meeting } from '../types/meeting';
import { Note } from '../types/note';
import NoteType from '../types/note-type';
import { Notion } from '../types/notion';
import { Task } from '../types/task';
import getNotesForDay from './get-notes-for-day';

export default function checkTaskTypes(
  savedNotes: (Note | Meeting | Notion | Task)[],
  date: Date
) {
  const thisDayNotes = getNotesForDay(savedNotes, date);

  return {
    hasTasks: thisDayNotes.some((note) => note.type === NoteType.task),
    hasNotions: thisDayNotes.some((note) => note.type === NoteType.notion),
    hasMeetings: thisDayNotes.some((note) => note.type === NoteType.meeting),
  };
}
