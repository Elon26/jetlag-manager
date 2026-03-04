import type { ModalStackParams } from '@/components/modals';
import { colors, shadows } from '@/config/theme';
import { Checkbox } from '@/ui/checkbox';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { scaleX } from '@kirz/nativewind-scale';
import { TouchableOpacity, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import Animated, { LinearTransition } from 'react-native-reanimated';
import type { Password } from '../hooks/use-secret-passwords/types';

type PasswordListItemProps = {
  item: Password;
  selectionMode: boolean;
  selected: boolean;

  onSelect: (id: string, selected: boolean) => void;
  onDelete: (item: Password) => void;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PasswordListItem({
  item,
  selectionMode,
  selected,
  onSelect,
  onDelete,
}: PasswordListItemProps) {
  const modal = useModal<ModalStackParams>();

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      layout={LinearTransition}
      className="mx-edge flex-row items-center rounded-2xl bg-white p-6"
      style={shadows.sm}
      onPress={() => {
        if (!selectionMode) {
          modal.openModal('SecretPasswordModal', { id: item.id });
        }
      }}
    >
      <View className="flex-1 gap-4">
        <View className="flex-row items-center justify-between">
          <UiText className="text-xl font-medium" numberOfLines={1}>
            {item.link ?? item.name}
          </UiText>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => onDelete(item)}
              activeOpacity={0.7}
              className="items-center justify-center rounded-full bg-[#FFEAEA]"
              style={{
                width: scaleX(48),
                height: scaleX(24),
              }}
            >
              <SfSymbol
                name="trash.fill"
                size={scaleX(14)}
                tintColor={colors.red.toString()}
              />
            </TouchableOpacity>

            {selectionMode && (
              <Checkbox
                checked={selected}
                onChange={(checked) => onSelect(item.id, checked)}
                className="rounded-full"
              />
            )}
          </View>
        </View>

        <View className="w-60 rounded-full bg-[#F2F2F2] px-4 py-3">
          <UiText className="text-xs color-gray" numberOfLines={1}>
            {item.login}
          </UiText>
        </View>
      </View>
    </AnimatedTouchable>
  );
}
