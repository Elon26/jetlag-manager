import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import type { NativeStackHeaderLeftProps } from '@react-navigation/native-stack';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export function HeaderLeft({
  tintColor,
  onPress,
}: NativeStackHeaderLeftProps & { onPress?: () => void }) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-1 pr-1"
      onPress={onPress ?? (() => router.back())}
    >
      <SfSymbol
        className="size-4 color-text"
        name="chevron.left"
        weight="bold"
      />
      <UiText
        adjustsFontSizeToFit
        className="text-lg font-semibold"
        style={{ color: tintColor }}
      >
        Back
      </UiText>
    </TouchableOpacity>
  );
}
