import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { shadows } from '@/config/theme';
import LockedIcon from '@/svg/main/locked.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

type StatItem = {
  value: string | number;
  Icon?: React.ComponentType<any>;
};

type SquareWidgetProps = {
  title: string;
  icon: React.ComponentType<any>;
  stats?: StatItem[];
  onPress?: () => void;
  locked?: boolean;
};

export function SquareWidget({
  title,
  icon: Icon,
  stats = [],
  onPress,
  locked = false,
}: SquareWidgetProps) {
  const { t } = useTranslation();
  return (
    <Pressable
      style={shadows.md}
      className="h-40 justify-between rounded-4xl bg-white p-5"
      onPress={onPress}
    >
      <View className="min-h-6 flex-row items-center justify-between">
        <UiText className="max-w-28 text-sm  font-medium">{title}</UiText>
        <View className="absolute right-0">{locked && <LockedIcon />}</View>
      </View>

      <View className="flex-row items-end justify-between">
        <Icon />

        {locked ? (
          <UiText className="w-14 text-right text-xs text-gray">
            {t('cleaner.widget.access')}
          </UiText>
        ) : stats.length > 0 ? (
          <View className="items-end gap-2">
            {stats.map(({ value, Icon: StatIcon }, index) => (
              <View key={index} className="flex-row items-center gap-1">
                <UiText className="text-xs">{value}</UiText>
                {StatIcon ? <StatIcon /> : null}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
