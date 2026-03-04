import { shadows } from '@/config/theme';
import { UiText } from '@/ui/ui-text';
import { scaleY } from '@kirz/nativewind-scale';
import { useStorageUsage } from '@kirz/react-native-device-info';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function StorageUsageWidget() {
  const { t } = useTranslation();
  const storageUsage = useStorageUsage();

  const used = storageUsage.total - storageUsage.free;
  const level =
    storageUsage.total > 0
      ? Math.min(Math.max(used / storageUsage.total, 0), 1)
      : 0;

  const percent = Math.round(level * 100);
  const usedGb = Math.round(used / 1000 / 1000 / 1000);
  const totalGb = Math.round(storageUsage.total / 1000 / 1000 / 1000);

  const [barWidth, setBarWidth] = useState(0);
  const progress = useSharedValue(0);

  const prevLevelRef = useRef(level);

  useEffect(() => {
    if (!barWidth) return;
    if (Math.abs(prevLevelRef.current - level) < 0.01) return;

    prevLevelRef.current = level;

    progress.value = withTiming(level, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [level, barWidth, progress]);

  const maskStyle = useAnimatedStyle(() => ({
    width: barWidth * progress.value,
  }));
  return (
    <View className="rounded-4xl bg-white p-4" style={shadows.md}>
      <UiText className="text-base font-semibold text-text">
        {t('cleaner.storage-usage.title.part1')}{' '}
        <UiText
          className="font-semibold"
          style={{ color: percent > 70 ? '#FF6767' : '#26B13C' }}
        >
          {percent}%
        </UiText>{' '}
        {t('cleaner.storage-usage.title.part2')}
      </UiText>

      <UiText className="mt-1 text-sm text-[#9C9C9F]">
        {t('cleaner.storage-usage.subtitle', { usedGb, totalGb })}
      </UiText>

      <View
        className="mt-3 overflow-hidden rounded-full bg-[#F2F2F2]"
        style={{ height: scaleY(16) }}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        {barWidth > 0 && (
          <Animated.View
            style={[
              { height: '100%', overflow: 'hidden', borderRadius: 999 },
              maskStyle,
            ]}
          >
            <AnimatedLinearGradient
              colors={['#E688F8', '#A2CBFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: barWidth,
                height: '100%',
                borderRadius: 999,
              }}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
