import type { PropsWithChildren } from 'react';
import { Easing } from 'react-native';
import {
  createModalStack,
  type ModalOptions,
  type ModalStack,
} from 'react-native-modalfy';

import { PaywallId } from '@/hooks/use-paywall/types';
import { PaywallModal } from '@/pages/paywall/paywall-modal';
import { SecretPasswordModal } from '@/pages/secret-folder/components/secret-password-modal';
import { ColorSelectorModal } from '@/pages/timezone/components/modals/color-selector-modal';
import { CreateMeetingModal } from '@/pages/timezone/components/modals/create-meeting-modal';
import { CreateNoteModal } from '@/pages/timezone/components/modals/create-note-modal';
import { CreateNotionModal } from '@/pages/timezone/components/modals/create-notion-modal';
import { CreateTaskModal } from '@/pages/timezone/components/modals/create-task-modal';
import { CreateTimezoneModal } from '@/pages/timezone/components/modals/create-timezone-modal';
import { EditMeetingModal } from '@/pages/timezone/components/modals/edit-meeting-modal';
import { EditNoteModal } from '@/pages/timezone/components/modals/edit-note-modal';
import { EditNotionModal } from '@/pages/timezone/components/modals/edit-notion-modal';
import { EditTaskModal } from '@/pages/timezone/components/modals/edit-task-modal';
import { EditTimezoneModal } from '@/pages/timezone/components/modals/edit-timezone-modal';
import { SelectNoteSortTypeModal } from '@/pages/timezone/components/modals/select-note-sort-type-modal';
import { SelectNoteTypeColorModal } from '@/pages/timezone/components/modals/select-note-type-color-modal';
import { SelectNoteTypeModal } from '@/pages/timezone/components/modals/select-note-type-modal';
import { TimeSelectorModal } from '@/pages/timezone/components/modals/time-selector-modal';
import Palette from '@/pages/timezone/types/palette';

import { CleanerHappyModal } from './cleaner-happy-modal';
import { CleaningModal } from './cleaning-modal';
import { FastCleanModal } from './fast-clean-modal';
import { FastHappyModal } from './fast-happy-modal';
import { LoaderModal } from './loader-modal';
import { RateModal } from './rate-modal';
import { SecretFolderModal } from './secret-folder-modal';

const defaultOptions: ModalOptions = {
  position: 'center',
  disableFlingGesture: true,
  backBehavior: 'none',
  backdropOpacity: 0.2,
  animateInConfig: {
    easing: Easing.inOut(Easing.exp),
    duration: 1000,
  },
} as const;

export type ModalStackParams = {
  Paywall: {
    id: PaywallId;
  };
  LoaderModal: never;
  CleanerHappyModal: PropsWithChildren;
  FastHappyModal: PropsWithChildren;
  CleaningModal: never;
  CreateTimezoneModal: {
    close: () => void;
    maxPriority: number;
  };
  EditTimezoneModal: {
    close: () => void;
    timezoneObjId: string;
  };
  ColorSelectorModal: {
    close: () => void;
    select: (name: Palette) => void;
    selectedColor: Palette;
  };
  SelectNoteTypeModal: {
    date: Date | null;
  };
  SelectNoteTypeColorModal: never;
  CreateNoteModal: never;
  EditNoteModal: {
    id: string;
  };
  CreateTaskModal: {
    date: Date | null | undefined;
  };
  EditTaskModal: {
    id: string;
  };
  CreateNotionModal: {
    date: Date | null | undefined;
  };
  EditNotionModal: {
    id: string;
  };
  SecretFolderModal: never;
  FastCleanModal: never;
  RateModal: never;
  CreateMeetingModal: {
    date: Date | null | undefined;
  };
  SecretPasswordModal: {
    id?: string;
  };
  EditMeetingModal: {
    id: string;
  };
  TimeSelectorModal: {
    close: () => void;
    select: (time: Date) => void;
    selectedTime: Date;
    type: 'date' | 'time';
  };
  SelectNoteSortTypeModal: {
    sortNotes: (sortType: string) => void;
  };
};

export const modalsStack: ModalStack<ModalStackParams> = createModalStack(
  {
    Paywall: {
      modal: PaywallModal,
      position: 'top',
    },
    LoaderModal,
    CleanerHappyModal,
    CleaningModal,
    CreateTimezoneModal: {
      modal: CreateTimezoneModal,
      position: 'top',
    },
    EditTimezoneModal: {
      modal: EditTimezoneModal,
      position: 'top',
    },
    RateModal,
    FastHappyModal,
    ColorSelectorModal,
    SelectNoteTypeModal,
    SelectNoteTypeColorModal,
    SecretFolderModal,
    FastCleanModal,
    CreateNoteModal: {
      modal: CreateNoteModal,
      position: 'top',
    },
    EditNoteModal: {
      modal: EditNoteModal,
      position: 'top',
    },
    CreateTaskModal: {
      modal: CreateTaskModal,
      position: 'top',
    },
    EditTaskModal: {
      modal: EditTaskModal,
      position: 'top',
    },
    CreateNotionModal: {
      modal: CreateNotionModal,
      position: 'top',
    },
    EditNotionModal: {
      modal: EditNotionModal,
      position: 'top',
    },
    CreateMeetingModal: {
      modal: CreateMeetingModal,
      position: 'top',
    },
    EditMeetingModal: {
      modal: EditMeetingModal,
      position: 'top',
    },
    TimeSelectorModal,
    SelectNoteSortTypeModal,
    SecretPasswordModal: {
      modal: SecretPasswordModal,
      disableFlingGesture: false,
    },
  },
  defaultOptions
);
