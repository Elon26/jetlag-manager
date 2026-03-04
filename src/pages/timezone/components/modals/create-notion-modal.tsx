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
import { schedulePushNotification } from '@/hooks/use-notifications';
import { useSetStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import NoteType from '../../types/note-type';
import { Notion } from '../../types/notion';

export function CreateNotionModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'CreateNotionModal'>) {
  const date = params?.date;
  const { openModal, closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const setSavedNotes = useSetStorage('savedNotes');

  const [windowHeight, setWindowHeight] = useState(height);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasNameError, setHasNameError] = useState(false);
  const [taskTime, setTaskTime] = useState(date || new Date());
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

  async function handleCreate() {
    if (!name) {
      setHasNameError(true);
      return;
    }

    const notificationId =
      taskTime.getTime() > Date.now()
        ? await schedulePushNotification(
            t('timezone.you-have-scheduled-task'),
            `${name} - ${description}`,
            taskTime
          )
        : null;

    const newNote: Notion = {
      id: uuid(),
      type: NoteType.notion,
      name,
      description,
      taskTime,
      taskPoints: null,
      taskEndTime: null,
      notificationId,
      members: null,
      creationTime: Date.now(),
      updateTime: Date.now(),
    };
    setSavedNotes((prev) => [...prev, newNote]);
    closeModal('CreateNotionModal');
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
          onPress={() => closeModal('CreateNotionModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.add-notion')}
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
          <View className="items-center">
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
