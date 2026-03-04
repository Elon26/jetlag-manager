import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import PlusImage from '@/images/plus.png';
import checkTaskTypes from '@/pages/timezone/utils/check-task-types';
import getNotesForDay from '@/pages/timezone/utils/get-notes-for-day';
import FakeCardBigIcon from '@/svg/time-zone/fake-card-big.svg';
import FakeCardBlueIcon from '@/svg/time-zone/fake-card-blue.svg';
import FakeCardGreenIcon from '@/svg/time-zone/fake-card-green.svg';
import StarIcon from '@/svg/time-zone/star.svg';
import { UiText } from '@/ui/ui-text';

import { shadows } from '@/config/theme';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import Palette from '@/pages/timezone/types/palette';
import { Image } from 'expo-image';
import NoteSmallCard from './note-small-card';

export default function ResumeArea() {
  const hasPremium = useHasPremiumWithBackdoor();
  const { t } = useTranslation();
  const savedNoteTypeColors = useStorageValue('savedNoteTypeColors');
  const savedNotes = useStorageValue('savedNotes');
  const today = new Date();
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const todayTasks = getNotesForDay(savedNotes, today);
  const {
    hasTasks: hasTodayTasks,
    hasNotions: hasTodayNotions,
    hasMeetings: hasTodayMeetings,
  } = checkTaskTypes(savedNotes, today);
  const tomorrowTasks = getNotesForDay(savedNotes, tomorrow);
  const {
    hasTasks: hasTomorrowTasks,
    hasNotions: hasTomorrowNotions,
    hasMeetings: hasTomorrowMeetings,
  } = checkTaskTypes(savedNotes, tomorrow);
  const hasAnyTasks =
    hasTodayTasks ||
    hasTodayNotions ||
    hasTodayMeetings ||
    hasTomorrowTasks ||
    hasTomorrowNotions ||
    hasTomorrowMeetings;

  return (
    <Pressable
      onPress={() => router.navigate('/timezone/note')}
      style={shadows.lg}
    >
      {hasAnyTasks ? (
        <View className="flex-row overflow-hidden rounded-3xl bg-white p-5">
          <View className="w-1/2 pr-1.5">
            <UiText className="text-xs font-light uppercase text-gray">
              {t('timezone.tomorrow')}
            </UiText>
            <View className="h-4 w-full flex-row items-center pl-1">
              {hasTomorrowTasks && (
                <View
                  className="size-2 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hasPremium
                      ? savedNoteTypeColors.task
                      : Palette.gray,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <StarIcon />
                </View>
              )}
              {hasTomorrowNotions && (
                <View
                  className="size-2 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hasPremium
                      ? savedNoteTypeColors.notion
                      : Palette.gray,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <StarIcon />
                </View>
              )}
              {hasTomorrowMeetings && (
                <View
                  className="size-2 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hasPremium
                      ? savedNoteTypeColors.meeting
                      : Palette.gray,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <StarIcon />
                </View>
              )}
            </View>
            <UiText className="text-sm font-medium">
              {t('timezone.events-upcoming', { count: tomorrowTasks.length })}
            </UiText>
            {tomorrowTasks.length > 0 && (
              <View className="mt-2 gap-y-2">
                {tomorrowTasks.map((task) => (
                  <NoteSmallCard
                    key={task.id}
                    type={task.type}
                    time={task.taskTime}
                    name={task.name}
                  />
                ))}
              </View>
            )}
          </View>
          <View className="w-1/2 pl-1.5">
            <UiText className="text-xs font-light uppercase text-gray">
              {t('timezone.today')}
            </UiText>
            <View className="h-4 w-full flex-row items-center pl-1">
              {hasTodayTasks && (
                <View
                  className="size-2 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hasPremium
                      ? savedNoteTypeColors.task
                      : Palette.gray,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <StarIcon />
                </View>
              )}
              {hasTodayNotions && (
                <View
                  className="size-2 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hasPremium
                      ? savedNoteTypeColors.notion
                      : Palette.gray,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <StarIcon />
                </View>
              )}
              {hasTodayMeetings && (
                <View
                  className="size-2 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: hasPremium
                      ? savedNoteTypeColors.meeting
                      : Palette.gray,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <StarIcon />
                </View>
              )}
            </View>
            <UiText className="text-sm font-medium">
              {t('timezone.events', { count: todayTasks.length })}
            </UiText>
            {todayTasks.length > 0 && (
              <View className="mt-2 gap-y-2">
                {todayTasks.map((task) => (
                  <NoteSmallCard
                    key={task.id}
                    type={task.type}
                    time={task.taskTime}
                    name={task.name}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-row justify-between gap-x-1 rounded-3xl bg-white p-5">
          <View style={{ width: scaleX(115) }}>
            <UiText className="text-xs font-light text-gray">
              {t('timezone.be-productive')}
            </UiText>
            <UiText className="font-medium">
              {t('timezone.add-event-long')}
            </UiText>
            <View className="mt-4 gap-y-4">
              <FakeCardBlueIcon />
              <FakeCardGreenIcon />
            </View>
          </View>
          <View className="">
            <FakeCardBigIcon />
          </View>
          <View
            className="absolute -left-2 bottom-0 flex-row items-center justify-between rounded-3xl border border-white bg-[#F3F3F3] px-5"
            style={{
              width: scaleX(174),
              height: scaleY(48),
              transform: [{ rotate: '5deg' }],
            }}
          >
            <UiText className="text-xl font-semibold">
              {t('timezone.add-event-short')}
            </UiText>
            <Image className="size-4" source={PlusImage} />
          </View>
          <View
            className="absolute -right-3 -top-0.5 flex-row items-center justify-between rounded-3xl border border-white bg-[#F3F3F3] px-5"
            style={{
              width: scaleX(174),
              height: scaleY(48),
              transform: [{ rotate: '5deg' }],
            }}
          >
            <UiText className="pr-1 text-xl font-semibold capitalize">
              {t('timezone.add-task')}
            </UiText>
            <Image className="size-4" source={PlusImage} />
          </View>
        </View>
      )}
    </Pressable>
  );
}
