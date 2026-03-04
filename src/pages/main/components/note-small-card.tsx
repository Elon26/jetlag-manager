import { scaleY } from '@kirz/nativewind-scale';
import { View } from 'react-native';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { useStorageValue } from '@/hooks/use-storage';
import NoteType from '@/pages/timezone/types/note-type';
import Palette from '@/pages/timezone/types/palette';
import { UiText } from '@/ui/ui-text';

type Props = {
  type: NoteType;
  time: Date | null;
  name: string;
};

export default function NoteSmallCard({ type, time, name }: Props) {
  const hasPremium = useHasPremiumWithBackdoor();
  const timeToHandle = new Date(time || 0);
  const savedNoteTypeColors = useStorageValue('savedNoteTypeColors');
  const taskColor = hasPremium ? savedNoteTypeColors[type] : Palette.gray;

  return (
    <View
      className="flex-row items-center justify-between gap-x-1 rounded-xl border-l-8 bg-gray/10 p-2"
      style={{ height: scaleY(47), borderColor: taskColor }}
    >
      <View className="h-full flex-1 justify-center">
        <UiText className="text-xs font-light text-gray">
          {timeToHandle.toLocaleTimeString('default', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          })}
        </UiText>
        <UiText numberOfLines={1} className="text-sm font-medium">
          {name}
        </UiText>
      </View>
    </View>
  );
}
