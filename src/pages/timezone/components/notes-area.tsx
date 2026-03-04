import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { UiText } from '@/ui/ui-text';

import { Meeting } from '../types/meeting';
import { Note } from '../types/note';
import { Notion } from '../types/notion';
import { Task } from '../types/task';
import { isBeforeToday, isThisMonth, isToday } from '../utils/date-compare';
import NoteCard from './note-card';

type Props = {
  savedNotes: (Note | Meeting | Notion | Task)[];
  toggler: boolean;
};

export default function NotesArea({ savedNotes, toggler }: Props) {
  const { t } = useTranslation();

  const [noDateNotes, setNoDateNotes] = useState<Note[]>([]);
  const [pastNotes, setPastNotes] = useState<(Meeting | Notion | Task)[]>([]);
  const [todayNotes, setTodayNotes] = useState<(Meeting | Notion | Task)[]>([]);
  const [thisMonthNotes, setThisMonthNotes] = useState<
    (Meeting | Notion | Task)[]
  >([]);
  const [laterNotes, setLaterNotes] = useState<(Meeting | Notion | Task)[]>([]);

  function render(savedNotes: (Note | Meeting | Notion | Task)[]) {
    const noDateNotes: Note[] = [];
    const pastNotes: (Meeting | Notion | Task)[] = [];
    const todayNotes: (Meeting | Notion | Task)[] = [];
    const thisMonthNotes: (Meeting | Notion | Task)[] = [];
    const laterNotes: (Meeting | Notion | Task)[] = [];

    savedNotes.forEach((note) => {
      if (!note.taskTime) {
        noDateNotes.push(note);
        return;
      }
      if (isBeforeToday(note.taskTime)) {
        pastNotes.push(note);
        return;
      }
      if (isToday(note.taskTime)) {
        todayNotes.push(note);
        return;
      }
      if (isThisMonth(note.taskTime)) {
        thisMonthNotes.push(note);
        return;
      }
      laterNotes.push(note);
    });

    setNoDateNotes(noDateNotes);
    setPastNotes(pastNotes);
    setTodayNotes(todayNotes);
    setThisMonthNotes(thisMonthNotes);
    setLaterNotes(laterNotes);
  }

  useEffect(() => {
    render(savedNotes);
  }, [savedNotes, toggler]);

  return (
    <View className="gap-y-2.5">
      {noDateNotes.length > 0 && (
        <View className="gap-y-2.5">
          <UiText className="text-xl font-bold">{t('timezone.no-date')}</UiText>
          {noDateNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              type={note.type}
              name={note.name}
              taskPoints={note.taskPoints}
              description={note.description}
              time={null}
              updateTime={note.updateTime}
            />
          ))}
        </View>
      )}
      {pastNotes.length > 0 && (
        <View className="gap-y-2.5">
          <UiText className="text-xl font-bold">{t('timezone.past')}</UiText>
          {pastNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              type={note.type}
              name={note.name}
              description={note.description}
              taskPoints={note.taskPoints}
              time={note.taskTime}
              updateTime={note.updateTime}
            />
          ))}
        </View>
      )}
      {todayNotes.length > 0 && (
        <View className="gap-y-2.5">
          <UiText className="text-xl font-bold">{t('timezone.today')}</UiText>
          {todayNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              type={note.type}
              name={note.name}
              description={note.description}
              taskPoints={note.taskPoints}
              time={note.taskTime}
              updateTime={note.updateTime}
            />
          ))}
        </View>
      )}
      {thisMonthNotes.length > 0 && (
        <View className="gap-y-2.5">
          <UiText className="text-xl font-bold">
            {t('timezone.this-month')}
          </UiText>
          {thisMonthNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              type={note.type}
              name={note.name}
              description={note.description}
              taskPoints={note.taskPoints}
              time={note.taskTime}
              updateTime={note.updateTime}
            />
          ))}
        </View>
      )}
      {laterNotes.length > 0 && (
        <View className="gap-y-2.5">
          <UiText className="text-xl font-bold">{t('timezone.later')}</UiText>
          {laterNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              type={note.type}
              name={note.name}
              description={note.description}
              taskPoints={note.taskPoints}
              time={note.taskTime}
              updateTime={note.updateTime}
            />
          ))}
        </View>
      )}
    </View>
  );
}
