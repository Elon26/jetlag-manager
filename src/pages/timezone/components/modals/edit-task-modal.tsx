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

import { TaskPoint } from '../../types/task-point';
import TaskPointItem from '../task-point-item';

export function EditTaskModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'EditTaskModal'>) {
  const id = params?.id;
  const { openModal, closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [savedNotes, setSavedNotes] = useStorage('savedNotes');
  const currentTask = savedNotes.find((note) => note.id === id);

  const [windowHeight, setWindowHeight] = useState(height);
  const [name, setName] = useState(currentTask?.name || '');
  const [taskPoints, setTaskPoints] = useState<TaskPoint[]>(
    currentTask?.taskPoints || []
  );
  const [taskTime, setTaskTime] = useState(
    currentTask?.taskTime ? new Date(currentTask.taskTime) : new Date()
  );
  const [hasNameError, setHasNameError] = useState(false);
  const nameInputRef = useRef<null | TextInput>(null);

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

  function changeTaskPointStatus(id: string) {
    setTaskPoints((prev) => {
      const updatedArr = prev.map((item) => {
        if (item.id === id) item.isComplete = !item.isComplete;
        return item;
      });
      return updatedArr;
    });
  }

  function removeTaskPoint(id: string) {
    setTaskPoints((prev) => {
      const updatedArr = prev.filter((item) => item.id !== id);
      return updatedArr;
    });
  }

  function handleAddTaskPoint() {
    nameInputRef.current?.blur();
    setTimeout(() => {
      Alert.prompt(t('timezone.enter-point'), undefined, [
        { text: t('timezone.cancel'), style: 'cancel' },
        {
          text: t('timezone.add'),
          onPress: (value) => {
            if (value) {
              setTaskPoints((prev) => [
                ...prev,
                { id: uuid(), title: value, isComplete: false },
              ]);
            }
          },
        },
      ]);
    }, 100);
  }

  async function handleEditTask() {
    if (!name) {
      setHasNameError(true);
      return;
    }

    let newNotificationId = null;
    if (currentTask?.notificationId) {
      cancelNotification(currentTask.notificationId);
      newNotificationId =
        taskTime.getTime() > Date.now()
          ? await schedulePushNotification(
              t('timezone.you-have-scheduled-task'),
              `${name}`,
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
              description: null,
              taskTime,
              taskPoints,
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
    closeModal('EditTaskModal');
  }

  function handleDelete() {
    if (currentTask?.notificationId)
      cancelNotification(currentTask.notificationId);
    const updatedNotes = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updatedNotes);
    closeModal('EditTaskModal');
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
          onPress={() => closeModal('EditTaskModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.edit-task')}
          </UiText>
          <ScrollView
            style={{ height: scaleY(380) }}
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
                    {t('timezone.task-name')}
                  </UiText>
                  <TextInput
                    ref={nameInputRef}
                    value={name}
                    onChangeText={setName}
                  />
                </Pressable>
                <View
                  className="gap-y-1 rounded-xl border-2 border-white bg-white p-2"
                  style={shadows.md}
                >
                  <UiText className="text-xs font-medium text-gray">
                    {t('timezone.description')}
                  </UiText>
                  {taskPoints.map((taskPoint) => (
                    <TaskPointItem
                      key={taskPoint.id}
                      id={taskPoint.id}
                      isComplete={taskPoint.isComplete}
                      title={taskPoint.title}
                      changeTaskPointStatus={changeTaskPointStatus}
                      removeTaskPoint={removeTaskPoint}
                    />
                  ))}
                  <UiPressable
                    className="flex-row items-center gap-x-1"
                    onPress={handleAddTaskPoint}
                  >
                    <SfSymbol name="plus" size={scaleX(14)} tintColor="blue" />
                    <UiText className="text-xs">
                      {t('timezone.add-task-point')}
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
                <UiButton
                  className="w-full rounded-xl"
                  onPress={handleEditTask}
                >
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
