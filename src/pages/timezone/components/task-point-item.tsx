import { scaleX } from '@kirz/nativewind-scale';
import { View } from 'react-native';

import { colors } from '@/config/theme';
import { Checkbox } from '@/ui/checkbox';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

type Props = {
  id: string;
  isComplete: boolean;
  title: string;
  changeTaskPointStatus: (id: string) => void;
  removeTaskPoint: (id: string) => void;
};

export default function TaskPointItem({
  id,
  isComplete,
  title,
  changeTaskPointStatus,
  removeTaskPoint,
}: Props) {
  return (
    <View className="flex-row items-center gap-x-1.5">
      <Checkbox
        checked={isComplete}
        onChange={() => changeTaskPointStatus(id)}
        isSmall
      />
      <UiText numberOfLines={1} className="flex-1 text-xs">
        {title}
      </UiText>
      <Pressable onPress={() => removeTaskPoint(id)}>
        <SfSymbol
          name="trash"
          size={scaleX(14)}
          tintColor={colors.red.toString()}
        />
      </Pressable>
    </View>
  );
}
