import { Meeting } from '@/pages/timezone/types/meeting';
import { Note } from '@/pages/timezone/types/note';
import { Notion } from '@/pages/timezone/types/notion';
import Palette from '@/pages/timezone/types/palette';
import { Task } from '@/pages/timezone/types/task';
import { TimezoneObj } from '@/pages/timezone/types/timezone-obj';

/**
 * The initial state of the storage.
 *
 * @warning
 * All keys must be defined. Use `null` for `undefined` values.
 */
export const initialStorageState = {
  isOnboardingFinished: false,
  secretFolderModalIsShown: false,
  firstLaunch: false,
  pinModalWasShown: false,
  autofillGuideShown: false,
  isFirstShowPaywall: false,
  introductoryPaywallShown: false,
  hasStartedSmartClean: false,
  hasDeveloperPremium: false,
  cleanSuccessCount: null as number | null,
  lastCleaningTimestamp: null as number | null,
  cleanerWidgetOkPending: null as number | null,
  cleanerWidgetHideUntil: null as number | null,
  favouriteSounds: [] as string[],

  savedTimezones: [] as TimezoneObj[],
  isFirstTimezonesLaunch: true,
  savedNotes: [] as (Note | Meeting | Notion | Task)[],
  savedNoteTypeColors: {
    note: Palette.lightGreen,
    task: Palette.blue,
    notion: Palette.lightPurple,
    meeting: Palette.yellow,
  },
  currentSortParam: 'fromAToZ',
  isNotificationPermissionGranted: false,
};

export type Storage = typeof initialStorageState;
