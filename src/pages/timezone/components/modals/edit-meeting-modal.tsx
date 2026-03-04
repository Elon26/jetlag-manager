import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
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
import { Pressable as UiPressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import MemberItem from '../member-item';

export function EditMeetingModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'EditMeetingModal'>) {
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
  const [hasNameError, setHasNameError] = useState(false);
  const [taskStartTime, setTaskStartTime] = useState(
    currentNote?.taskTime ? new Date(currentNote.taskTime) : new Date()
  );
  const [taskEndTime, setTaskEndTime] = useState(
    currentNote?.taskEndTime ? new Date(currentNote.taskEndTime) : new Date()
  );
  const [members, setMembers] = useState<string[]>(currentNote?.members || []);
  const nameInputRef = useRef<null | TextInput>(null);
  const descriptionInputRef = useRef<null | TextInput>(null);

  function handleChangeTaskStartTime(time: Date) {
    const newDate = new Date(
      taskEndTime.getFullYear(),
      taskEndTime.getMonth(),
      taskEndTime.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    if (newDate <= taskEndTime) setTaskStartTime(newDate);
  }

  function handleChangeTaskEndTime(time: Date) {
    const newDate = new Date(
      taskEndTime.getFullYear(),
      taskEndTime.getMonth(),
      taskEndTime.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    if (newDate >= taskStartTime) setTaskEndTime(newDate);
  }

  function handleChangeTaskDate(date: Date) {
    setTaskStartTime(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        taskStartTime.getHours(),
        taskStartTime.getMinutes()
      )
    );
    setTaskEndTime(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        taskEndTime.getHours(),
        taskEndTime.getMinutes()
      )
    );
  }

  function handleDelete() {
    if (currentNote?.notificationId)
      cancelNotification(currentNote.notificationId);
    const updatedNotes = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updatedNotes);
    closeModal('EditMeetingModal');
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
        taskStartTime.getTime() > Date.now()
          ? await schedulePushNotification(
              t('timezone.you-have-scheduled-task'),
              `${name} - ${description}`,
              taskStartTime
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
              taskTime: taskStartTime,
              taskPoints: null,
              taskEndTime,
              notificationId: newNotificationId,
              members,
              creationTime: note.creationTime,
              updateTime: Date.now(),
            }
          : note;
      });
      return newArr;
    });
    closeModal('EditMeetingModal');
  }

  function removeMember(member: string) {
    setMembers((prev) => {
      const updatedArr = prev.filter((item) => item !== member);
      return updatedArr;
    });
  }

  function handleAddMember() {
    nameInputRef.current?.blur();
    setTimeout(() => {
      Alert.prompt(t('timezone.enter-member-name'), undefined, [
        { text: t('timezone.cancel'), style: 'cancel' },
        {
          text: t('timezone.add'),
          onPress: (value) => {
            if (value) {
              setMembers((prev) => [...prev, value]);
            }
          },
        },
      ]);
    }, 100);
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
      <View
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5 "
        style={{
          width: width - scaleX(32),
        }}
      >
        <Pressable
          className="absolute right-2 top-2 size-10 items-center justify-center"
          onPress={() => closeModal('EditMeetingModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.edit-meeting')}
          </UiText>
          <ScrollView
            style={{ height: scaleY(440) }}
            showsVerticalScrollIndicator={false}
            className="overflow-visible"
          >
            <View className="gap-y-8">
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
                    {t('timezone.meeting-name')}
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
                <View
                  className="gap-y-1 rounded-xl border-2 border-white bg-white p-2"
                  style={shadows.md}
                >
                  <UiText className="text-xs font-medium text-gray">
                    {t('timezone.members')}
                  </UiText>
                  <View className="gap-y-1">
                    {members.map((member) => (
                      <MemberItem
                        key={uuid()}
                        name={member}
                        removeMember={removeMember}
                      />
                    ))}
                  </View>
                  <UiPressable
                    className="flex-row items-center gap-x-1"
                    onPress={handleAddMember}
                  >
                    <SfSymbol name="plus" size={scaleX(14)} tintColor="blue" />
                    <UiText className="text-xs">
                      {t('timezone.add-member')}
                    </UiText>
                  </UiPressable>
                </View>
                <View className="flex-row gap-x-2.5">
                  <Pressable
                    className="flex-1 gap-y-1 rounded-xl border-2 border-white bg-white p-2"
                    style={shadows.md}
                    onPress={() =>
                      openModal('TimeSelectorModal', {
                        select: (selectedTime) => {
                          handleChangeTaskStartTime(selectedTime);
                          closeModal('TimeSelectorModal');
                        },
                        close: () => closeModal('TimeSelectorModal'),
                        selectedTime: taskStartTime,
                        type: 'time',
                      })
                    }
                  >
                    <UiText className="text-xs font-medium text-gray">
                      {t('timezone.start-time')}
                    </UiText>
                    <UiText className="font-medium">
                      {taskStartTime.toLocaleTimeString('default', {
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
                          handleChangeTaskEndTime(selectedTime);
                          closeModal('TimeSelectorModal');
                        },
                        close: () => closeModal('TimeSelectorModal'),
                        selectedTime: taskEndTime,
                        type: 'time',
                      })
                    }
                  >
                    <UiText className="text-xs font-medium text-gray">
                      {t('timezone.end-time')}
                    </UiText>
                    <UiText className="font-medium">
                      {taskEndTime.toLocaleTimeString('default', {
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
                        selectedTime: taskStartTime,
                        type: 'date',
                      })
                    }
                  >
                    <UiText className="text-xs font-medium text-gray">
                      {t('timezone.date')}
                    </UiText>
                    <UiText className="font-medium">
                      {taskStartTime.toLocaleDateString('default', {
                        year: '2-digit',
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
          </ScrollView>
        </View>
      </View>
    </BlurView>
  );
}
