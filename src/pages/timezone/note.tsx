import { scaleY } from '@kirz/nativewind-scale';
import { router, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Layout } from '@/components/layout';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { registerForPushNotificationsAsync } from '@/hooks/use-notifications';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorage } from '@/hooks/use-storage';
import ArrowLeftIcon from '@/svg/back.svg';
import NoteColorsIcon from '@/svg/time-zone/note-colors.svg';
import NoteSettingsIcon from '@/svg/time-zone/note-settings.svg';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';

import NotesArea from './components/notes-area';
import TimeZoneFooter from './components/timezone-footer';
import ZeroNotesArea from './components/zero-notes-area';
import { Meeting } from './types/meeting';
import { Note } from './types/note';
import { Notion } from './types/notion';
import { Task } from './types/task';

export default function TimeZoneNotePage() {
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useStorage('isNotificationPermissionGranted');
  const navigation = useNavigation();
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const { openModal, closeModal } = useModals();
  const [savedNotes] = useStorage('savedNotes');
  const [currentSortParam, setCurrentSortParam] =
    useStorage('currentSortParam');
  const [sortedSavedNotes, setSortedSavedNotes] =
    useState<(Note | Meeting | Notion | Task)[]>(savedNotes);
  const [toggler, setToggler] = useState(false);

  function handleAddNewNote() {
    if (!hasPremium && savedNotes.length >= 7) {
      showPaywall();
    } else {
      openModal('SelectNoteTypeModal', { date: null });
    }
  }

  function handleSortNotes(sortType: string) {
    setCurrentSortParam(sortType);
    closeModal('SelectNoteSortTypeModal');
  }

  function sortNotes(sortType: string) {
    if (sortType === 'byType') {
      return savedNotes.sort((x, y) => {
        if (x.type < y.type) return -1;
        if (x.type > y.type) return 1;
        return 0;
      });
    }
    if (sortType === 'byTime') {
      return savedNotes.sort((x, y) => {
        const taskTimeOne = new Date(x.taskTime || 0).getTime();
        const taskTimeTwo = new Date(y.taskTime || 0).getTime();
        return taskTimeOne - taskTimeTwo;
      });
    }
    if (sortType === 'byChangeDate') {
      return savedNotes.sort((x, y) => {
        const taskTimeOne = new Date(x.updateTime || 0).getTime();
        const taskTimeTwo = new Date(y.updateTime || 0).getTime();
        return taskTimeOne - taskTimeTwo;
      });
    }
    if (sortType === 'byAddDate') {
      return savedNotes.sort((x, y) => {
        const taskTimeOne = new Date(x.creationTime || 0).getTime();
        const taskTimeTwo = new Date(y.creationTime || 0).getTime();
        return taskTimeOne - taskTimeTwo;
      });
    }
    if (sortType === 'fromAToZ') {
      return savedNotes.sort((x, y) => {
        if (x.name < y.name) return -1;
        if (x.name > y.name) return 1;
        return 0;
      });
    }
    if (sortType === 'fromZToA') {
      return savedNotes.sort((x, y) => {
        if (x.name > y.name) return -1;
        if (x.name < y.name) return 1;
        return 0;
      });
    }
    return savedNotes.sort((x, y) => {
      if (x.name < y.name) return -1;
      if (x.name > y.name) return 1;
      return 0;
    });
  }

  useEffect(() => {
    const sortResult = sortNotes(currentSortParam);
    setSortedSavedNotes(sortResult);
    setToggler((prev) => !prev);
  }, [savedNotes, currentSortParam]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View className="flex-row gap-x-2">
            <Pressable onPress={() => openModal('SelectNoteTypeColorModal')}>
              <NoteColorsIcon />
            </Pressable>
            <Pressable
              onPress={() =>
                openModal('SelectNoteSortTypeModal', {
                  sortNotes: handleSortNotes,
                })
              }
            >
              <NoteSettingsIcon />
            </Pressable>
          </View>
        );
      },
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
      {savedNotes.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: scaleY(92),
          }}
          showsVerticalScrollIndicator={false}
          className="overflow-visible"
        >
          <NotesArea savedNotes={sortedSavedNotes} toggler={toggler} />
        </ScrollView>
      ) : (
        <View className="bottom-18 flex-1 items-center justify-center">
          <ZeroNotesArea />
        </View>
      )}

      <Pressable
        className="absolute bottom-30 left-1/2 size-11 items-center justify-center rounded-full bg-primary"
        onPress={handleAddNewNote}
      >
        <SfSymbol className="size-6 color-white" name="plus" />
      </Pressable>
      <TimeZoneFooter />
    </Layout>
  );
}
