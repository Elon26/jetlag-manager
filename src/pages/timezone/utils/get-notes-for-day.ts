import { Meeting } from '../types/meeting';
import { Note } from '../types/note';
import { Notion } from '../types/notion';
import { Task } from '../types/task';

export default function getNotesForDay(
  savedNotes: (Note | Meeting | Notion | Task)[],
  date: Date
) {
  return savedNotes.filter((note) => {
    const noteDay = new Date(note.taskTime as Date);

    return (
      date.getFullYear() === noteDay.getFullYear() &&
      date.getMonth() === noteDay.getMonth() &&
      date.getDate() === noteDay.getDate()
    );
  });
}
