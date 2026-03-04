import { scaleX } from '@kirz/nativewind-scale';
import { View } from 'react-native';

import { colors } from '@/config/theme';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

type Props = {
  name: string;
  removeMember: (name: string) => void;
};

export default function MemberItem({ name, removeMember }: Props) {
  return (
    <View className="flex-row items-center gap-x-1.5">
      <UiText numberOfLines={1} className="flex-1 text-xs">
        {name}
      </UiText>
      <Pressable onPress={() => removeMember(name)}>
        <SfSymbol
          name="trash"
          size={scaleX(14)}
          tintColor={colors.red.toString()}
        />
      </Pressable>
    </View>
  );
}
