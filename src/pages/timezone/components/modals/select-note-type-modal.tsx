import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalStackParams } from '@/components/modals';
import { shadows } from '@/config/theme';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorageValue } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import AlarmIcon from '@/svg/time-zone/alarm.svg';
import CameraIcon from '@/svg/time-zone/camera.svg';
import CheckIcon from '@/svg/time-zone/check.svg';
import LockIcon from '@/svg/time-zone/lock.svg';
import PencilIcon from '@/svg/time-zone/pencil.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function SelectNoteTypeModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'SelectNoteTypeModal'>) {
  const date = params?.date;
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const { openModal, closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    note: noteColor,
    task: taskColor,
    notion: notionColor,
    meeting: meetingColor,
  } = useStorageValue('savedNoteTypeColors');

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
          onPress={() => closeModal('SelectNoteTypeModal')}
        >
          <CloseIcon />
        </Pressable>
        <UiText className="text-center text-2xl font-semibold">
          {t('timezone.select-note-type')}
        </UiText>
        <View className="flex-row flex-wrap justify-center gap-2.5">
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() => {
              closeModal('SelectNoteTypeModal');
              setTimeout(() => {
                openModal('CreateNoteModal');
              }, 250);
            }}
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.note')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: noteColor + '20' }}
            >
              <PencilIcon stroke={noteColor} />
            </View>
          </Pressable>
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() => {
              closeModal('SelectNoteTypeModal');
              setTimeout(() => {
                openModal('CreateTaskModal', { date });
              }, 250);
            }}
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.task')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: taskColor + '20' }}
            >
              <CheckIcon fill={taskColor} />
            </View>
          </Pressable>
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() => {
              closeModal('SelectNoteTypeModal');
              setTimeout(() => {
                if (hasPremium) {
                  openModal('CreateNotionModal', { date });
                } else {
                  showPaywall();
                }
              }, 250);
            }}
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.notion')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: notionColor + '20' }}
            >
              <AlarmIcon fill={notionColor} />
            </View>
            {!hasPremium && (
              <View className="absolute right-5 top-5">
                <LockIcon />
              </View>
            )}
          </Pressable>
          <Pressable
            className="size-35 items-center justify-between rounded-3xl bg-white p-5"
            style={shadows.md}
            onPress={() => {
              closeModal('SelectNoteTypeModal');
              setTimeout(() => {
                if (hasPremium) {
                  openModal('CreateMeetingModal', { date });
                } else {
                  showPaywall();
                }
              }, 250);
            }}
          >
            <UiText className="text-sm font-semibold">
              {t('timezone.meeting')}
            </UiText>
            <View
              className="size-13 items-center justify-center rounded-full"
              style={{ backgroundColor: meetingColor + '20' }}
            >
              <CameraIcon fill={meetingColor} />
            </View>
            {!hasPremium && (
              <View className="absolute right-5 top-5">
                <LockIcon />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </BlurView>
  );
}
