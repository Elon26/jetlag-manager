import { scaleY } from '@kirz/nativewind-scale';
import { router, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Layout } from '@/components/layout';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { registerForPushNotificationsAsync } from '@/hooks/use-notifications';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorage, useStorageValue } from '@/hooks/use-storage';
import ArrowLeftIcon from '@/svg/back.svg';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

import FullCalendarArea from './components/full-calendar-area';
import NoteCard from './components/note-card';
import ShortCalendarArea from './components/short-calendar-area';
import TimeZoneFooter from './components/timezone-footer';
import getNotesForDay from './utils/get-notes-for-day';

export default function TimeZoneCalendarPage() {
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useStorage('isNotificationPermissionGranted');
  const savedNotes = useStorageValue('savedNotes');
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const { openModal } = useModals();
  const navigation = useNavigation();

  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useState(
    getNotesForDay(savedNotes, selectedDay)
  );

  function handleAddNewNote() {
    if (!hasPremium && savedNotes.length >= 7) {
      showPaywall();
    } else {
      openModal('SelectNoteTypeModal', { date: selectedDay });
    }
  }

  useEffect(() => {
    setTodayTasks(getNotesForDay(savedNotes, selectedDay));
  }, [savedNotes, selectedDay]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View className="flex-row gap-x-2">
            <Pressable onPress={() => router.navigate('/main')}>
              <ArrowLeftIcon />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (!isNotificationPermissionGranted) {
      setIsNotificationPermissionGranted(true);
      registerForPushNotificationsAsync();
    }
  }, []);

  return (
    <Layout className="flex-1 gap-y-2.5 overflow-visible px-4">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: scaleY(75),
        }}
        showsVerticalScrollIndicator={false}
        className="overflow-visible"
      >
        <View className="gap-y-4">
          <View>
            {isFullCalendarOpen ? (
              <FullCalendarArea
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                setIsCalendarOpen={setIsFullCalendarOpen}
              />
            ) : (
              <ShortCalendarArea
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                setIsCalendarOpen={setIsFullCalendarOpen}
              />
            )}
          </View>
          <View className="flex-row items-center justify-between">
            <UiText className="text-lg font-medium">
              {selectedDay.toLocaleDateString('default', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              })}
            </UiText>
            <Pressable
              className="size-9 items-center justify-center rounded-full bg-primary"
              onPress={handleAddNewNote}
            >
              <SfSymbol className="size-5 color-white" name="plus" />
            </Pressable>
          </View>
          {todayTasks.length > 0 && (
            <View className="gap-y-2.5">
              {todayTasks.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  type={note.type}
                  name={note.name}
                  taskPoints={note.taskPoints}
                  description={note.description}
                  time={note.taskTime}
                  updateTime={note.updateTime}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TimeZoneFooter />
    </Layout>
  );
}
