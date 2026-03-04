import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useSpeedTest } from '@/hooks/use-speedtest';
import radius from '@/images/speed-test/radius.png';
import { UiText } from '@/ui/ui-text';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const W = 300;
const H = 150;
const R = 120;
const CX = W / 2;
const CY = H / 2 + 10;

const START_DEG = 190;
const END_DEG = -10;

function arcPath(r: number, startDeg: number, endDeg: number) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const a0 = rad(startDeg);
  const a1 = rad(endDeg);

  const sx = CX + r * Math.cos(a0);
  const sy = CY - r * Math.sin(a0);
  const ex = CX + r * Math.cos(a1);
  const ey = CY - r * Math.sin(a1);

  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
}

const ARC_D = arcPath(R, START_DEG, END_DEG);
const ARC_LEN = (Math.PI * R * Math.abs(END_DEG - START_DEG)) / 180;

const STROKE = 22;
const COLOR_BG = '#F1F1F1';
const BASE_WIDTH = scaleX(350);

export function SpeedTestArc() {
  const { t } = useTranslation();
  const { statusAtom, progressAtom, resultsAtom } = useSpeedTest();

  const status = useAtomValue(statusAtom);
  const progress = useAtomValue(progressAtom);
  const result = useAtomValue(resultsAtom);

  const prevStatusRef = useRef<typeof status | null>(null);

  const arcProgress = useSharedValue(0);
  const currentValue =
    status === 'testing' ? (progress?.result ?? 0) : (result.upload ?? 0);
  const normalized = (() => {
    if (currentValue <= 0) return 0;

    let max = 100;
    if (currentValue >= 1000) max = 2000;
    else if (currentValue >= 500) max = 1000;
    else if (currentValue >= 300) max = 500;
    else if (currentValue >= 200) max = 300;
    else if (currentValue >= 100) max = 200;

    return Math.min(1, Math.max(0.02, currentValue / max));
  })();

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    cancelAnimation(arcProgress);

    if (prevStatus === 'testing' && status !== 'testing') {
      arcProgress.value = withTiming(0, {
        duration: 1400,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (status !== 'testing') {
      arcProgress.value = 0;
      return;
    }
    arcProgress.value = withSpring(normalized, {
      damping: 12,
      stiffness: 140,
      mass: 0.7,
    });
  }, [status, normalized, arcProgress]);

  const animatedProps = useAnimatedProps(() => {
    const v = Math.max(0, Math.min(1, arcProgress.value));
    return {
      strokeDashoffset: (1 - v) * ARC_LEN,
    };
  });

  const centerValue =
    status === 'testing'
      ? (progress?.result?.toFixed(1) ?? '--.--')
      : (result.upload?.toFixed(1) ?? '--.--');

  const label =
    status === 'testing'
      ? progress?.type === 'download'
        ? t('speed-test.download')
        : progress?.type === 'upload'
          ? t('speed-test.upload')
          : ''
      : '';

  const quality = (() => {
    if (currentValue > 60) {
      return { label: t('speed-test.quality.good'), color: '#4CAF50' };
    }
    if (currentValue > 20) {
      return { label: t('speed-test.quality.average'), color: '#FFC107' };
    }
    return { label: t('speed-test.quality.bad'), color: '#FF5252' };
  })();

  const showQuality = status === 'testing' || currentValue > 0;

  return (
    <View style={{ width: BASE_WIDTH, height: scaleY(320) }}>
      <Image
        source={radius}
        contentFit="cover"
        style={{
          width: scaleX(300),
          height: scaleX(300),
          position: 'absolute',
          top: scaleX(34),
          left: scaleX(24),
          zIndex: 10,
        }}
      />
      <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {currentValue > 0 ? (
          <UiText className="text-5xl font-semibold text-text">
            {centerValue}
            <UiText className="text-base text-gray">
              {t('speed-test.mbs')}
            </UiText>
          </UiText>
        ) : (
          <UiText className="text-5xl font-light text-text">--.--</UiText>
        )}
      </View>

      <View className="absolute left-1/2 top-[60%] -translate-x-1/2">
        <UiText className="text-lg font-medium text-gray opacity-70">
          {label}
        </UiText>
      </View>
      <View className="absolute left-1/2 top-[70%] -translate-x-1/2">
        {showQuality && (
          <UiText className="text-xl font-medium opacity-70">
            {t('speed-test.quality.title')}{' '}
            <UiText style={{ color: quality.color }} className="font-bold">
              {quality.label}
            </UiText>
          </UiText>
        )}
      </View>
      <Svg width={BASE_WIDTH} height={BASE_WIDTH} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#3971FF" />
            <Stop offset="50%" stopColor="#78B29E" />
            <Stop offset="100%" stopColor="#A4E059" />
          </LinearGradient>
        </Defs>

        <Path
          d={ARC_D}
          stroke={COLOR_BG}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={[ARC_LEN]}
        />

        <AnimatedPath
          d={ARC_D}
          stroke="url(#arcGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={[ARC_LEN]}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}
