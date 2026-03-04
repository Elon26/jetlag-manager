import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { colors } from '@/config/theme';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

import NoteType from '../types/note-type';
import Palette from '../types/palette';
import { TaskPoint } from '../types/task-point';
import { isToday } from '../utils/date-compare';

type Props = {
  id: string;
  type: NoteType;
  time: Date | null;
  name: string;
  description: string | null;
  taskPoints: TaskPoint[] | null;
  updateTime: number;
};

export default function NoteCard({
  id,
  type,
  time,
  name,
  description,
  taskPoints,
  updateTime,
}: Props) {
  const hasPremium = useHasPremiumWithBackdoor();
  const timeToHandle = time ? new Date(time) : null;
  const { openModal } = useModals();
  const savedNoteTypeColors = useStorageValue('savedNoteTypeColors');
  const taskColor = hasPremium ? savedNoteTypeColors[type] : Palette.gray;
  let editModalName:
    | 'EditNoteModal'
    | 'EditTaskModal'
    | 'EditNotionModal'
    | 'EditMeetingModal' = 'EditNoteModal';
  if (type === NoteType.task) editModalName = 'EditTaskModal';
  if (type === NoteType.notion) editModalName = 'EditNotionModal';
  if (type === NoteType.meeting) editModalName = 'EditMeetingModal';

  return (
    <Pressable
      className="flex-row items-center justify-between gap-x-1 rounded-xl border-l-8 bg-white p-2"
      style={{
        height: scaleY(timeToHandle ? 98 : 70),
        borderColor: taskColor,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
      onPress={() => openModal(editModalName, { id })}
    >
      <View className="h-full flex-1 justify-center">
        {timeToHandle && (
          <UiText className="mb-2 text-xl font-bold">
            {timeToHandle.toLocaleTimeString('default', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            {!isToday(timeToHandle) &&
              timeToHandle.toLocaleDateString('default', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
          </UiText>
        )}
        <UiText numberOfLines={1} className="text-lg font-medium">
          {name}
        </UiText>
        {description && (
          <UiText numberOfLines={1} className="text-xs text-gray">
            {description}
          </UiText>
        )}
        {taskPoints && (
          <View className="flex-row gap-x-1 overflow-hidden">
            {taskPoints.map((taskPoint, index) => (
              <View
                key={taskPoint.id}
                className="flex-row items-center gap-x-1"
              >
                {index > 0 && <UiText>·</UiText>}
                <UiText
                  numberOfLines={1}
                  className={twMerge(
                    'text-xs text-gray',
                    taskPoint.isComplete ? 'line-through' : ''
                  )}
                >
                  {taskPoint.title}
                </UiText>
              </View>
            ))}
          </View>
        )}
        <UiText className="text-2xs text-gray">
          {new Date(updateTime).toLocaleDateString('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}{' '}
          {new Date(updateTime).toLocaleTimeString('default', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          })}
        </UiText>
      </View>

      <UiText className="text-xl font-bold">
        <SfSymbol
          name="chevron.right"
          size={scaleX(14)}
          tintColor={colors.gray.toString()}
        />
      </UiText>
    </Pressable>
  );
}
