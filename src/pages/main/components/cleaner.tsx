import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { shadows } from '@/config/theme';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import { ButtonPrimary } from '@/ui/button-primary';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';
import { scaleX } from '@kirz/nativewind-scale';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function ProgressCircle({ progress }: { progress: number }) {
  const size = scaleX(95);
  const stroke = scaleX(12);
  const radius = (size - stroke) / 2.1;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference * (1 - animatedProgress.value);
    return { strokeDashoffset: offset };
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3870FF33"
          strokeWidth={stroke}
          fill="none"
        />

        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3870FF"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          fill="none"
        />
      </Svg>

      <View style={{ position: 'absolute' }}>
        <UiText className="text-lg font-semibold">
          {Math.round(progress * 100)}%
        </UiText>
      </View>
    </View>
  );
}

export function CleanerWidget() {
  const hideUntil = useStorageValue('cleanerWidgetHideUntil');
  const setHideUntil = useSetStorage('cleanerWidgetHideUntil');

  const lastCleaned = useStorageValue('lastCleaningTimestamp');
  const setLastCleaned = useSetStorage('lastCleaningTimestamp');

  const okPending = useStorageValue('cleanerWidgetOkPending');
  const setOkPending = useSetStorage('cleanerWidgetOkPending');
  const [state, setState] = useState<'idle' | 'progress' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const [shouldHideAnimated, setShouldHideAnimated] = useState(false);
  const [showOkOnFocus, setShowOkOnFocus] = useState(false);

  const { t } = useTranslation();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const postHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (postHideTimeoutRef.current) {
      clearTimeout(postHideTimeoutRef.current);
      postHideTimeoutRef.current = null;
    }
  }, []);

  const needsBoost = useMemo(() => {
    if (!lastCleaned) return true;
    const lastCleanTime = Number(lastCleaned);
    const now = Date.now();
    const daysDiff = (now - lastCleanTime) / (1000 * 3600 * 24);
    return daysDiff >= 7;
  }, [lastCleaned]);

  const collapse = useSharedValue(1);

  useEffect(() => {
    collapse.value = withTiming(shouldHideAnimated ? 0 : 1, { duration: 320 });
  }, [shouldHideAnimated]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: collapse.value,
    transform: [{ scale: 0.95 + collapse.value * 0.05 }],
    marginTop: collapse.value,
    marginBottom: collapse.value,
    overflow: 'hidden',
  }));

  const hideFor7Days = useCallback(() => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    setHideUntil(Date.now() + sevenDays);
  }, [setHideUntil]);

  useFocusEffect(
    useCallback(() => {
      clearTimers();

      const hasPending = okPending !== null && okPending !== undefined;

      if (!needsBoost && hasPending) {
        setShowOkOnFocus(true);
        setShouldHideAnimated(false);
        setProgress(1);
        setState('success');

        hideTimeoutRef.current = setTimeout(() => {
          setShouldHideAnimated(true);
          setShowOkOnFocus(false);

          postHideTimeoutRef.current = setTimeout(() => {
            setOkPending(null);
            hideFor7Days();
          }, 350);
        }, 3000);
      }

      return () => clearTimers();
    }, [clearTimers, hideFor7Days, needsBoost, okPending, setOkPending])
  );

  const startScan = () => {
    if (timerRef.current) return;

    clearTimers();
    setShowOkOnFocus(false);
    setShouldHideAnimated(false);

    setState('progress');
    setProgress(0);

    let p = 0;
    timerRef.current = setInterval(() => {
      p += 0.01;
      if (p >= 1) p = 1;
      setProgress(p);

      if (p >= 1) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setTimeout(() => setState('success'), 300);
      }
    }, 60);
  };

  const handleBoost = () => {
    const now = Date.now();

    setOkPending(now);

    router.navigate('/gallery-organiser');

    setTimeout(() => {
      setShouldHideAnimated(true);
    }, 120);

    setTimeout(() => {
      hideFor7Days();
    }, 450);
  };

  const hasPending = okPending !== null && okPending !== undefined;
  if (
    !showOkOnFocus &&
    !hasPending &&
    hideUntil &&
    Number(hideUntil) > Date.now()
  )
    return null;

  return (
    <Animated.View style={animatedContainerStyle}>
      <Pressable
        style={shadows.sm}
        className="mt-2.5 h-30 w-full rounded-4.5xl bg-white"
      >
        {state === 'idle' && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="items-center px-2 py-5">
              <UiText className="mb-4 text-center text-sm font-semibold">
                {t('cleaner.widget.title')}
              </UiText>
              <ButtonPrimary
                label={t('cleaner.widget.scan-button')}
                onPress={startScan}
              />
            </View>
          </Animated.View>
        )}

        {state === 'progress' && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex-row items-center justify-between p-3"
          >
            <ProgressCircle progress={progress} />
            <View className="flex-1 items-center">
              <UiText className="text-sm font-semibold">
                {t('cleaner.widget.processing')}
              </UiText>
              <View className="mt-4 h-11 w-50 items-center justify-center rounded-2xl bg-[#3870FF50]">
                <UiText className="font-semibold text-white">
                  {t('cleaner.widget.scanning')}
                </UiText>
              </View>
            </View>
          </Animated.View>
        )}

        {state === 'success' && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(300)}
          >
            {needsBoost ? (
              <View className="items-center justify-between px-2 py-5">
                <UiText className="mb-3 text-center text-sm font-semibold">
                  {t('cleaner.widget.needs-boost')}
                </UiText>
                <ButtonPrimary
                  label={t('cleaner.widget.boost-button')}
                  onPress={handleBoost}
                />
              </View>
            ) : (
              <View className="items-center justify-center py-13">
                <UiText className="text-center text-sm font-semibold">
                  {t('cleaner.widget.no-boost-needed')}
                </UiText>
              </View>
            )}
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}
