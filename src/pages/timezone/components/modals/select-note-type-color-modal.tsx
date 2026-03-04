import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shadows } from '@/config/theme';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { Pressable } from '@/ui/pressable';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import Palette from '../../types/palette';

export function SelectNoteTypeColorModal() {
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const { openModal, closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [savedNoteTypeColors, setSavedNoteTypeColors] = useStorage(
    'savedNoteTypeColors'
  );
  const [selectedNoteColor, setSelectedNoteColor] = useState(
    savedNoteTypeColors.note
  );
  const [selectedTaskColor, setSelectedTaskColor] = useState(
    savedNoteTypeColors.task
  );
  const [selectedNotionColor, setSelectedNotionColor] = useState(
    savedNoteTypeColors.notion
  );
  const [selectedMeetingColor, setSelectedMeetingColor] = useState(
    savedNoteTypeColors.meeting
  );

  function handleSaveSelectedColors() {
    if (hasPremium) {
      setSavedNoteTypeColors({
        note: selectedNoteColor,
        task: selectedTaskColor,
        notion: selectedNotionColor,
        meeting: selectedMeetingColor,
      });
      closeModal('SelectNoteTypeColorModal');
    } else {
      if (
        selectedNoteColor !== Palette.lightGreen ||
        selectedTaskColor !== Palette.blue ||
        selectedNotionColor !== Palette.lightPurple ||
        selectedMeetingColor !== Palette.yellow
      ) {
        showPaywall();
        setSelectedNoteColor(Palette.lightGreen);
        setSelectedTaskColor(Palette.blue);
        setSelectedNotionColor(Palette.lightPurple);
        setSelectedMeetingColor(Palette.yellow);
      } else {
        closeModal('SelectNoteTypeColorModal');
      }
    }
  }

  return (
    <BlurView
      className="items-center justify-center"
      style={{
        width,
        height,
        paddingBottom: insets.bottom + scaleY(10),
      }}
      tint="dark"
      intensity={30}
    >
      <View
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5"
        style={{
          width: width - scaleX(32),
        }}
      >
        <Pressable
          className="absolute right-2 top-2 size-10 items-center justify-center"
          onPress={() => closeModal('SelectNoteTypeColorModal')}
        >
          <CloseIcon />
        </Pressable>
        <UiText className="text-center text-2xl font-semibold">
          {t('timezone.select-color')}
        </UiText>
        <View className="flex-row flex-wrap justify-center gap-2.5">
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() =>
              openModal('ColorSelectorModal', {
                select: (selectedColor) => {
                  setSelectedNoteColor(selectedColor);
                  closeModal('ColorSelectorModal');
                },
                close: () => closeModal('ColorSelectorModal'),
                selectedColor: selectedNoteColor,
              })
            }
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.note')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: selectedNoteColor }}
            />
          </Pressable>
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() =>
              openModal('ColorSelectorModal', {
                select: (selectedColor) => {
                  setSelectedTaskColor(selectedColor);
                  closeModal('ColorSelectorModal');
                },
                close: () => closeModal('ColorSelectorModal'),
                selectedColor: selectedTaskColor,
              })
            }
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.task')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: selectedTaskColor }}
            />
          </Pressable>
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() =>
              openModal('ColorSelectorModal', {
                select: (selectedColor) => {
                  setSelectedNotionColor(selectedColor);
                  closeModal('ColorSelectorModal');
                },
                close: () => closeModal('ColorSelectorModal'),
                selectedColor: selectedNotionColor,
              })
            }
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.notion')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: selectedNotionColor }}
            />
          </Pressable>
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() =>
              openModal('ColorSelectorModal', {
                select: (selectedColor) => {
                  setSelectedMeetingColor(selectedColor);
                  closeModal('ColorSelectorModal');
                },
                close: () => closeModal('ColorSelectorModal'),
                selectedColor: selectedMeetingColor,
              })
            }
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.meeting')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: selectedMeetingColor }}
            />
          </Pressable>
        </View>
        <UiButton
          className="w-full rounded-xl"
          onPress={handleSaveSelectedColors}
        >
          <UiText className="text-xl font-semibold capitalize text-white">
            {t('basic.save')}
          </UiText>
        </UiButton>
      </View>
    </BlurView>
  );
}
