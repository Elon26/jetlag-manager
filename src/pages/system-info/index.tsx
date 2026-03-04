import {
  prettyBytes,
  useMemoryUsage,
  usePowerState,
  useStorageUsage,
} from '@kirz/react-native-device-info';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Layout } from '@/components/layout';
import { shadows } from '@/config/theme';
import { UiText } from '@/ui/ui-text';
import { scaleX } from '@kirz/nativewind-scale';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';
import { InfoBlock } from './components/info';

function formatBytes(value: number) {
  return prettyBytes(value, {
    formatter: ({ value, units }) =>
      `${value} ${units[0]}${units.slice(1).toLowerCase()}`,
  });
}

function CircleProgress({ progress }: { progress: number }) {
  const size = scaleX(80);
  const strokeWidth = scaleX(10.5);
  const radius = (size - strokeWidth) / 2.1;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center">
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Defs>
          <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#3870FF50" />
            <Stop offset="100%" stopColor="#3870FF" />
          </SvgLinearGradient>
        </Defs>

        <Circle
          stroke="#E0E7FF"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke="url(#grad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <UiText className="text-lg font-semibold text-[#3870FF]">
          {Math.round(progress * 100)}%
        </UiText>
      </View>
    </View>
  );
}

export function SystemInfo() {
  const { t } = useTranslation();
  const ramUsage = useMemoryUsage();
  const storageUsage = useStorageUsage();
  const { batteryLevel } = usePowerState();

  const level = batteryLevel ?? 0;
  const fullUsageHours = 24;
  const remainingTotalMinutes = Math.round(level * fullUsageHours * 60);

  const remainingHours = Math.floor(remainingTotalMinutes / 60);
  const ramUsed = ramUsage.total - ramUsage.free;
  const ramLevel = ramUsed / ramUsage.total;

  const storageUsed = storageUsage.total - storageUsage.free;
  const storageLevel =
    storageUsage.total > 0
      ? Math.min(Math.max(storageUsed / storageUsage.total, 0), 1)
      : 0;

  return (
    <Layout className="flex-1 px-4" scroll>
      <View className="gap-4">
        <View
          className="justify-between gap-4 rounded-xl bg-white px-5 py-5"
          style={shadows.md}
        >
          <UiText className="text-sm font-semibold">
            {t('system-info.storage.title')}
          </UiText>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View>
                <UiText className="text-sm text-[#00000060]">
                  {t('system-info.storage.free')}
                </UiText>
                <UiText className="pt-1 text-sm font-medium">
                  {formatBytes(storageUsage.free)}
                </UiText>
              </View>
              <View className="h-8 w-[1px] bg-black/20" />
              <View>
                <UiText className="text-sm text-[#00000060]">
                  {t('system-info.storage.total')}
                </UiText>
                <UiText className="pt-1 text-sm font-medium">
                  {formatBytes(storageUsage.total)}
                </UiText>
              </View>
            </View>
            <CircleProgress progress={storageLevel} />
          </View>
        </View>

        <View
          className=" justify-between gap-4 rounded-xl bg-white p-5"
          style={shadows.md}
        >
          <UiText className="text-sm font-semibold">
            {t('system-info.ram.title')}
          </UiText>
          <View className="flex-row items-center gap-4">
            <View>
              <UiText className="text-sm text-[#00000060]">
                {t('system-info.ram.free')}
              </UiText>
              <UiText className="pt-1 text-sm font-medium">
                {formatBytes(ramUsage.free)}
              </UiText>
            </View>
            <View className="h-8 w-[1px] bg-black/20" />
            <View>
              <UiText className="text-sm text-[#00000060]">
                {t('system-info.ram.total')}
              </UiText>
              <UiText className="pt-1 text-sm font-medium">
                {formatBytes(ramUsage.total)}
              </UiText>
            </View>
          </View>
          <View className="mt-1 h-4 w-full overflow-hidden rounded-full bg-[#FF723D34]">
            <LinearGradient
              colors={['#FF723D63', '#FF723D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: `${ramLevel * 100}%`,
                height: '100%',
                borderRadius: 9999,
              }}
            />
          </View>
        </View>
        <View
          className=" justify-between gap-4 rounded-xl bg-white p-5"
          style={shadows.md}
        >
          <UiText className="text-sm font-semibold">
            {t('system-info.battery.title')}
          </UiText>
          <View className="flex-row">
            <UiText className="text-sm font-medium text-[#00000060]">
              {t('system-info.battery.remaining-time')}: {remainingHours}h{' '}
            </UiText>
            <UiText className="ml-4 text-sm font-semibold">
              {Math.round((batteryLevel ?? 0) * 100)}%
            </UiText>
          </View>
          <View className="mt-1 h-4 w-full overflow-hidden rounded-full bg-[#29CC6A26]">
            <LinearGradient
              colors={['#29CC6A36', '#29CC6A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: `${level * 100}%`,
                height: '100%',
                borderRadius: 9999,
              }}
            />
          </View>
        </View>
        <InfoBlock />
      </View>
    </Layout>
  );
}
