import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useStorageValue } from '@/hooks/use-storage';
import StarIcon from '@/svg/time-zone/star.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import Palette from '../types/palette';
import checkTaskTypes from '../utils/check-task-types';

type Props = {
  selectedDay: Date;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
  setIsCalendarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ShortCalendarArea({
  selectedDay,
  setSelectedDay,
  setIsCalendarOpen,
}: Props) {
  const hasPremium = useHasPremiumWithBackdoor();
  const { t } = useTranslation();
  const savedNoteTypeColors = useStorageValue('savedNoteTypeColors');
  const savedNotes = useStorageValue('savedNotes');
  const today = new Date();
  const weekdays = [
    t('timezone.weekdays.monday'),
    t('timezone.weekdays.tuesday'),
    t('timezone.weekdays.wednesday'),
    t('timezone.weekdays.thursday'),
    t('timezone.weekdays.friday'),
    t('timezone.weekdays.saturday'),
    t('timezone.weekdays.sunday'),
  ];
  const weekDayNumbers = getWeekDayNumbers();

  function getWeekDayNumbers() {
    const currentWeekDay = today.getDay();
    const currentDayNumber = today.getDate();
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      currentDayNumber - (currentWeekDay || 7) + 1
    );
    const result = [monday];

    for (let i = 1; i < 7; i++) {
      const currentDay = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i
      );
      result.push(currentDay);
    }

    return result;
  }

  return (
    <View className="gap-y-2 rounded-xl bg-white p-4">
      <UiText className="text-center text-sm font-bold">
        {today.toLocaleDateString('default', {
          year: 'numeric',
          month: 'long',
        })}
      </UiText>
      <View className="flex-row justify-between">
        {weekdays.map((day) => (
          <View key={day} className="size-8 items-center justify-center">
            <UiText className="text-center text-xs">{day}</UiText>
          </View>
        ))}
      </View>
      <View className="flex-row justify-between">
        {weekDayNumbers.map((day) => {
          const { hasTasks, hasNotions, hasMeetings } = checkTaskTypes(
            savedNotes,
            day
          );
          return (
            <Pressable key={day.getTime()} onPress={() => setSelectedDay(day)}>
              <View
                className={twMerge(
                  'size-8 items-center justify-center rounded-lg',
                  selectedDay.getDate() === day.getDate() && 'bg-gray/20',
                  today.getDate() === day.getDate() && 'bg-primary'
                )}
              >
                <UiText
                  className={twMerge(
                    'text-center text-xs',
                    today.getDate() === day.getDate() && 'text-white'
                  )}
                >
                  {day.getDate()}
                </UiText>
                <View className="absolute bottom-0 left-0 w-full flex-row items-center justify-center">
                  {hasTasks && (
                    <View
                      className="size-2 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: hasPremium
                          ? savedNoteTypeColors.task
                          : Palette.gray,
                      }}
                    >
                      <StarIcon />
                    </View>
                  )}
                  {hasNotions && (
                    <View
                      className="size-2 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: hasPremium
                          ? savedNoteTypeColors.notion
                          : Palette.gray,
                      }}
                    >
                      <StarIcon />
                    </View>
                  )}
                  {hasMeetings && (
                    <View
                      className="size-2 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: hasPremium
                          ? savedNoteTypeColors.meeting
                          : Palette.gray,
                      }}
                    >
                      <StarIcon />
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      <UiButton
        className="mt-2 bg-gray/10"
        onPress={() => setIsCalendarOpen(true)}
      >
        <UiText>{t('timezone.open-all')}</UiText>
      </UiButton>
    </View>
  );
}
