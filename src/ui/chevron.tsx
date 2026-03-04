import { scaleX } from '@kirz/nativewind-scale';
import { View } from 'react-native';
import { colors } from '@/config/theme';
import { SfSymbol } from './sf-symbol';

type ChevronProps = {
  color?: string;
};

export function ChevronRight({ color = colors.white.toString() }: ChevronProps) {
  return (
    <View className="size-5 justify-center items-center">
      <SfSymbol name="chevron.right" size={scaleX(14)} tintColor={color} weight="light" />
    </View>
  );
}
