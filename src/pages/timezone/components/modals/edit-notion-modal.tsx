import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Pressable,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { ModalStackParams } from '@/components/modals';
import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import {
  cancelNotification,
  schedulePushNotification,
} from '@/hooks/use-notifications';
import { useStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

export function EditNotionModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'EditNotionModal'>) {
  const id = params?.id;
  const { openModal, closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [savedNotes, setSavedNotes] = useStorage('savedNotes');
  const currentNote = savedNotes.find((note) => note.id === id);

  const [windowHeight, setWindowHeight] = useState(height);
  const [name, setName] = useState(currentNote?.name || '');
  const [description, setDescription] = useState(
    currentNote?.description || ''
  );
  const [taskTime, setTaskTime] = useState(
    currentNote?.taskTime ? new Date(currentNote.taskTime) : new Date()
  );
  const [hasNameError, setHasNameError] = useState(false);
  const nameInputRef = useRef<null | TextInput>(null);
  const descriptionInputRef = useRef<null | TextInput>(null);

  function handleChangeTaskTime(time: Date) {
    setTaskTime(
      new Date(
        taskTime.getFullYear(),
        taskTime.getMonth(),
        taskTime.getDate(),
        time.getHours(),
        time.getMinutes()
      )
    );
  }

  function handleChangeTaskDate(date: Date) {
    setTaskTime(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        taskTime.getHours(),
        taskTime.getMinutes()
      )
    );
  }

  function handleDelete() {
    if (currentNote?.notificationId)
      cancelNotification(currentNote.notificationId);
    const updatedNotes = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updatedNotes);
    closeModal('EditNotionModal');
  }

  async function handleCreate() {
    if (!name) {
      setHasNameError(true);
      return;
    }

    let newNotificationId = null;
    if (currentNote?.notificationId) {
      cancelNotification(currentNote.notificationId);
      newNotificationId =
        taskTime.getTime() > Date.now()
          ? await schedulePushNotification(
              t('timezone.you-have-scheduled-task'),
              `${name} - ${description}`,
              taskTime
            )
          : null;
    }

    setSavedNotes((prev) => {
      const newArr = prev.map((note) => {
        return note.id === id
          ? {
              id: note.id,
              type: note.type,
              name,
              description,
              taskTime,
              taskPoints: null,
              taskEndTime: null,
              notificationId: newNotificationId,
              members: null,
              creationTime: note.creationTime,
              updateTime: Date.now(),
            }
          : note;
      });
      return newArr;
    });
    closeModal('EditNotionModal');
  }

  useEffect(() => {
    setHasNameError(false);
  }, [name]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setWindowHeight(height - e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setWindowHeight(height);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <BlurView
      className="items-center justify-center"
      style={{
        width,
        height: windowHeight,
      }}
      tint="dark"
      intensity={30}
    >
      <Pressable
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5 "
        style={{
          width: width - scaleX(32),
        }}
        onPress={() => {
          nameInputRef.current?.blur();
          descriptionInputRef.current?.blur();
        }}
      >
        <Pressable
          className="absolute right-2 top-2 size-10 items-center justify-center"
          onPress={() => closeModal('EditNotionModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.edit-notion')}
          </UiText>
          <View className="gap-y-4">
            <Pressable
              className={twMerge(
                'gap-y-1 rounded-xl border-2 border-white bg-white p-2',
                hasNameError ? 'border-red' : 'border-white'
              )}
              style={shadows.md}
              onPress={() => nameInputRef.current?.focus()}
            >
              <UiText className="text-xs font-medium text-gray">
                {t('timezone.notion-name')}
              </UiText>
              <TextInput
                ref={nameInputRef}
                value={name}
                onChangeText={setName}
              />
            </Pressable>
            <Pressable
              className="gap-y-1 rounded-xl border-2 border-white bg-white p-2"
              style={shadows.md}
              onPress={() => descriptionInputRef.current?.focus()}
            >
              <UiText className="text-xs font-medium text-gray">
                {t('timezone.description')}
              </UiText>
              <TextInput
                ref={descriptionInputRef}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                style={{ height: scaleY(74) }}
              />
            </Pressable>
            <View className="flex-row gap-x-2.5">
              <Pressable
                className="flex-1 gap-y-1 rounded-xl border-2 border-white bg-white p-2"
                style={shadows.md}
                onPress={() =>
                  openModal('TimeSelectorModal', {
                    select: (selectedTime) => {
                      handleChangeTaskTime(selectedTime);
                      closeModal('TimeSelectorModal');
                    },
                    close: () => closeModal('TimeSelectorModal'),
                    selectedTime: taskTime,
                    type: 'time',
                  })
                }
              >
                <UiText className="text-xs font-medium text-gray">
                  {t('timezone.time')}
                </UiText>
                <UiText className="font-medium">
                  {taskTime.toLocaleTimeString('default', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </UiText>
              </Pressable>
              <Pressable
                className="flex-1 gap-y-1 rounded-xl border-2 border-white bg-white p-2"
                style={shadows.md}
                onPress={() =>
                  openModal('TimeSelectorModal', {
                    select: (selectedTime) => {
                      handleChangeTaskDate(selectedTime);
                      closeModal('TimeSelectorModal');
                    },
                    close: () => closeModal('TimeSelectorModal'),
                    selectedTime: taskTime,
                    type: 'date',
                  })
                }
              >
                <UiText className="text-xs font-medium text-gray">
                  {t('timezone.date')}
                </UiText>
                <UiText className="font-medium">
                  {taskTime.toLocaleDateString('default', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </UiText>
              </Pressable>
            </View>
          </View>
          <View className="items-center gap-y-2">
            <UiButton
              className="w-full rounded-xl bg-red"
              onPress={handleDelete}
            >
              <UiText className="text-xl font-semibold capitalize text-white">
                {t('basic.delete')}
              </UiText>
            </UiButton>
            <UiButton className="w-full rounded-xl" onPress={handleCreate}>
              <UiText className="text-xl font-semibold capitalize text-white">
                {t('basic.save')}
              </UiText>
            </UiButton>
          </View>
        </View>
      </Pressable>
    </BlurView>
  );
}
