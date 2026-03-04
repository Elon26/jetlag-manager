import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { MotiView } from 'moti';
import numbro from 'numbro';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import { CameraRoll, CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import { UiText } from '@/ui/ui-text';

import { refetchAll } from '@/pages/gallery-organiser/hooks/use-cleaner-album';
import { useTotalUsage } from '@/pages/gallery-organiser/hooks/use-total-usage';

type Props = {
  progress: number;
};

export function AnimatedCircle({ progress }: Props) {
  const size = scaleX(200);
  const stroke = scaleX(15);
  const radius = (size - stroke) / 2.05;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(100, progress));
  const dash = (clamped / 100) * circumference;

  return (
    <View className="items-center pb-8">
      <View style={{ width: size, height: size }} className="relative">
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F2F3F3"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2F6BFF"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
            fill="none"
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <UiText className="text-[42px] font-medium text-text">
            {Math.round(clamped)}%
          </UiText>
          <UiText className="mt-1 text-xl text-[#858886]">Completed</UiText>
        </View>
      </View>
    </View>
  );
}

const LIMIT = 100;

type Phase = 'working' | 'done' | 'empty' | 'error';

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function toId(uri: string) {
  return uri.replace('ph://', '');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function FastCleanModal() {
  const { closeModal, openModal } = useModals();
  const setLastCleaningTimestamp = useSetStorage('lastCleaningTimestamp');
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { logEvent } = useAnalytics();
  const { items } = useTotalUsage();

  const [phase, setPhase] = useState<Phase>('working');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ count: number; freed: string } | null>(
    null
  );
  const itemsSnapshotRef = useRef(items);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        logEvent('fast_clean_started');

        if (cancelled) return;
        setPhase('working');
        setProgress(0);
        setResult(null);

        const snap = itemsSnapshotRef.current;

        const allUris = uniq([
          ...snap.screenshots.items,
          ...snap.blurryPhotos.items,
          ...snap.selfies.items,
          ...snap.livePhotos.items,
          ...snap.similarPhotos.items.flat(),
        ]);

        const ids = uniq(allUris.map(toId));

        if (!ids.length) {
          if (!cancelled) setPhase('empty');
          return;
        }
        const latest = ids.slice(0, LIMIT);
        const info = await CleanerGalleryApiV2.getDetails(latest);
        const bytes = info.reduce(
          (acc: number, a: any) => acc + (a.size || 0),
          0
        );
        if (cancelled) return;
        setProgress(25);
        await sleep(250);
        if (cancelled) return;
        setProgress(50);
        await sleep(250);
        if (cancelled) return;
        setProgress(75);
        await sleep(250);
        if (cancelled) return;

        const { success } = await CameraRoll.deleteAssets(latest);
        if (!success) throw new Error('Delete failed');

        if (cancelled) return;
        setProgress(100);

        refetchAll();
        setLastCleaningTimestamp(Date.now());
        const freed = numbro(bytes).format({
          output: 'byte',
          base: 'decimal',
          mantissa: 1,
        });

        setResult({ count: latest.length, freed });
        setPhase('done');
      } catch (e) {
        console.log(e);
        if (!cancelled) setPhase('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [logEvent, setLastCleaningTimestamp]);
  const title = useMemo(() => {
    if (phase === 'done') return 'Done';
    if (phase === 'empty') return 'Nothing to clean';
    if (phase === 'error') return 'Something went wrong';
    return 'Cleaning process in progress';
  }, [phase]);

  const subtitle = useMemo(() => {
    if (phase === 'done') return 'Tap Continue to see results';
    if (phase === 'empty') return 'No files found for cleaning';
    if (phase === 'error') return 'Please try again';
    return 'Please don’t close the app';
  }, [phase]);

  const buttonLabel = useMemo(() => {
    if (phase === 'done') return 'Continue';
    if (phase === 'empty') return 'Close';
    if (phase === 'error') return 'Close';
    return 'Cleaning...';
  }, [phase]);

  const canClose = phase !== 'working';
  const canContinue = phase === 'done';

  return (
    <View
      className="items-center justify-center"
      style={{
        width,
        height,
        paddingBottom: insets.bottom + scaleY(10),
      }}
    >
      <MotiView
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        className="z-20 w-[91%]"
        from={{ opacity: 0, translateY: scaleY(120), scale: 1.05 }}
        transition={{
          opacity: {
            type: 'timing',
            duration: 800,
            easing: Easing.out(Easing.cubic),
          },
          translateY: {
            type: 'timing',
            duration: 800,
            easing: Easing.out(Easing.cubic),
          },
          scale: {
            type: 'timing',
            duration: 800,
            easing: Easing.out(Easing.cubic),
          },
        }}
      >
        <View className="rounded-3xl bg-white px-4 py-10" style={shadows.md}>
          <UiText className="mb-4 text-center text-2xl font-semibold text-text">
            {title}
          </UiText>
          <View className="mb-8 gap-4 rounded-3xl bg-[#FBFBFB] p-2.5">
            <UiText className=" text-center text-lg font-medium text-[#111111]">
              {subtitle}
            </UiText>
            <UiText className="text-center text-sm text-[#111111] opacity-50">
              This action will take a few seconds
            </UiText>
          </View>
          <AnimatedCircle progress={progress} />
          <TouchableOpacity
            disabled={phase === 'working'}
            onPress={() => {
              if (phase === 'working') return;

              if (phase === 'done' && result) {
                closeModal('FastCleanModal');
                setTimeout(() => {
                  openModal('FastHappyModal', {
                    children: (
                      <UiText className="text-center text-gray">
                        <UiText className="font-medium text-primary">
                          {result.count} files
                        </UiText>{' '}
                        and freed{' '}
                        <UiText className="font-medium text-primary">
                          {result.freed}
                        </UiText>{' '}
                        of space
                      </UiText>
                    ),
                  });
                }, 80);

                return;
              }
              closeModal('FastCleanModal');
            }}
            className={`h-14 items-center justify-center rounded-2xl ${
              canContinue ? 'bg-primary' : 'bg-[#EFEFEF]'
            }`}
            style={{ opacity: phase === 'working' ? 0.6 : 1 }}
          >
            <UiText
              className={`text-xl font-semibold ${
                canContinue ? 'text-white' : 'text-text'
              }`}
            >
              {buttonLabel}
            </UiText>
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
}
