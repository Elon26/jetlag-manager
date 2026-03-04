import { scaleX } from '@kirz/nativewind-scale';
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
import { schedulePushNotification } from '@/hooks/use-notifications';
import { useSetStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { Pressable as UiPressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import NoteType from '../../types/note-type';
import { Task } from '../../types/task';
import { TaskPoint } from '../../types/task-point';
import TaskPointItem from '../task-point-item';

export function CreateTaskModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'CreateTaskModal'>) {
  const date = params?.date;
  const { openModal, closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const setSavedNotes = useSetStorage('savedNotes');

  const [windowHeight, setWindowHeight] = useState(height);
  const [name, setName] = useState('');
  const [taskPoints, setTaskPoints] = useState<TaskPoint[]>([]);
  const [taskTime, setTaskTime] = useState(date || new Date());
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

  async function handleCreateTask() {
    if (!name) {
      setHasNameError(true);
      return;
    }

    const notificationId =
      taskTime.getTime() > Date.now()
        ? await schedulePushNotification(
            t('timezone.you-have-scheduled-task'),
            `${name}`,
            taskTime
          )
        : null;

    const newTask: Task = {
      id: uuid(),
      type: NoteType.task,
      name,
      taskPoints,
      taskTime,
      description: null,
      taskEndTime: null,
      notificationId,
      members: null,
      creationTime: Date.now(),
      updateTime: Date.now(),
    };
    setSavedNotes((prev) => [...prev, newTask]);
    closeModal('CreateTaskModal');
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
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5"
        style={{
          width: width - scaleX(32),
        }}
      >
        <Pressable
          className="absolute right-2 top-2 size-10 items-center justify-center"
          onPress={() => closeModal('CreateTaskModal')}
        >
          <CloseIcon />
        </Pressable>
        <View className="gap-y-8">
          <UiText className="text-center text-2xl font-semibold">
            {t('timezone.add-task')}
          </UiText>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="overflow-hidden"
          >
            <View className="gap-y-8 p-1.5">
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
                    <SfSymbol
                      name="plus"
                      size={scaleX(14)}
                      tintColor="#3870FF"
                      weight="bold"
                    />
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
              <View className="items-center">
                <UiButton
                  className="w-full rounded-xl"
                  onPress={handleCreateTask}
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
