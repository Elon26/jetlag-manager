import { scaleY } from '@kirz/nativewind-scale';
import { Dispatch, SetStateAction } from 'react';
import { Pressable, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { twMerge } from 'tailwind-merge';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useStorageValue } from '@/hooks/use-storage';
import ArrowLeftIcon from '@/svg/arrow-left-small.svg';
import ArrowRightIcon from '@/svg/arrow-right-small.svg';
import StarIcon from '@/svg/time-zone/star.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import CalendarDate from '../types/calendar-date';
import Palette from '../types/palette';
import checkTaskTypes from '../utils/check-task-types';

type Props = {
  selectedDay: Date;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
  setIsCalendarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function FullCalendarArea({
  selectedDay,
  setSelectedDay,
  setIsCalendarOpen,
}: Props) {
  const hasPremium = useHasPremiumWithBackdoor();
  const today = new Date();
  const savedNotes = useStorageValue('savedNotes');
  const savedNoteTypeColors = useStorageValue('savedNoteTypeColors');

  return (
    <View className="relative">
      <Calendar
        current={
          selectedDay.getFullYear().toString() +
          '-' +
          (selectedDay.getMonth() + 1).toString() +
          '-' +
          selectedDay.getDate()
        }
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          paddingBottom: scaleY(75),
        }}
        firstDay={1}
        theme={{
          textMonthFontWeight: 'bold',
          monthTextColor: '#23242B',
          arrowColor: '#23242B',
          textSectionTitleColor: '#23242B',
        }}
        dayComponent={({
          date,
          state,
        }: {
          date: CalendarDate;
          state: string;
        }) => {
          const isSelectedDay =
            date.year === selectedDay.getFullYear() &&
            date.month === selectedDay.getMonth() + 1 &&
            date.day === selectedDay.getDate();
          const isThisDayToday =
            date.year === today.getFullYear() &&
            date.month === today.getMonth() + 1 &&
            date.day === today.getDate();
          const { hasTasks, hasNotions, hasMeetings } = checkTaskTypes(
            savedNotes,
            new Date(date.year, date.month - 1, date.day)
          );

          return (
            <Pressable
              onPress={() =>
                setSelectedDay(new Date(date.year, date.month - 1, date.day))
              }
            >
              <View
                className={twMerge(
                  'relative size-8 items-center justify-center gap-y-2.5 rounded-xl',
                  isSelectedDay && 'bg-gray/20',
                  isThisDayToday && 'bg-primary'
                )}
              >
                <UiText
                  className="text-xs"
                  style={{
                    color:
                      state === 'disabled'
                        ? '#B9B9B9'
                        : isThisDayToday
                          ? 'white'
                          : 'black',
                  }}
                >
                  {date.day}
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
        }}
        renderArrow={(direction: string) => (
          <View className="size-7 items-center justify-center rounded-xl bg-background">
            {direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />}
          </View>
        )}
      />
      <UiButton
        className="absolute bottom-4 left-4 mt-2 bg-gray/10"
        onPress={() => setIsCalendarOpen(false)}
      >
        <UiText>{t('timezone.close')}</UiText>
      </UiButton>
    </View>
  );
}
