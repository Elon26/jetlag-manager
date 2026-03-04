import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import { useTotalUsage } from '@/pages/gallery-organiser/hooks/use-total-usage';

import { usePaywall } from '@/hooks/use-paywall';
import { useCleanerAlbum } from '@/pages/gallery-organiser/hooks/use-cleaner-album';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

const ALBUM_COLORS = {
  similarPhotos: '#008F5A',
  screenshots: '#FF6767',
  blurryPhotos: '#008CCF',
  selfies: '#6D398B',
  livePhotos: '#F28E1C',
} as const;

const MIN_PERCENT = 0.01;

export function GallerySummaryWidget() {
  const { t } = useTranslation();
  const lastCleaned = useStorageValue('lastCleaningTimestamp');

  const hasStartedSmartClean = useStorageValue('hasStartedSmartClean');
  const setHasStartedSmartClean = useSetStorage('hasStartedSmartClean');

  const showProgress = hasStartedSmartClean === true;

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const needsCleaning = !lastCleaned || (now - Number(lastCleaned)) / DAY >= 7;
  const albums = useMemo(
    () =>
      [
        {
          key: 'similarPhotos',
          label: t('cleaner.gallery-organiser.categories.similar-photos'),
        },
        {
          key: 'screenshots',
          label: t('cleaner.gallery-organiser.categories.screenshots'),
        },
        {
          key: 'blurryPhotos',
          label: t('cleaner.gallery-organiser.categories.blurry-photos'),
        },
        {
          key: 'selfies',
          label: t('cleaner.gallery-organiser.categories.selfie'),
        },
        {
          key: 'livePhotos',
          label: t('cleaner.gallery-organiser.categories.live-photos'),
        },
      ] as const,
    [t]
  );

  return (
    <View className="rounded-4xl bg-white p-4" style={shadows.md}>
      {showProgress ? (
        <CategoryProgressBar />
      ) : (
        <View
          className="overflow-hidden rounded-full bg-[#F3F3F3]"
          style={{ height: scaleY(19) }}
        />
      )}
      <View className="mt-4 flex-row flex-wrap justify-center gap-x-4 gap-y-2">
        {albums.map((a) => (
          <View key={a.key} className="flex-row items-center gap-2">
            <View
              style={{
                width: scaleX(8),
                height: scaleX(8),
                borderRadius: 4,
                backgroundColor: ALBUM_COLORS[a.key],
              }}
            />
            <UiText className="text-xs text-text">{a.label}</UiText>
          </View>
        ))}
      </View>
      {showProgress ? (
        <ActiveButton />
      ) : (
        <Pressable
          // onPress={() => router.navigate('/gallery-organiser')}
          onPress={() => {
            setHasStartedSmartClean(true);
          }}
          style={{ backgroundColor: needsCleaning ? '#FF6767' : '#26B13C' }}
          className="mt-4 h-15 items-center justify-center rounded-2xl "
        >
          <UiText className="text-xl font-medium color-white">
            {t('cleaner.widget.start-smart-clean')}
          </UiText>
        </Pressable>
      )}
    </View>
  );
}

function ActiveButton() {
  const { t } = useTranslation();
  const { premiumAction } = usePaywall();
  const { openModal } = useModals();
  const lastCleaned = useStorageValue('lastCleaningTimestamp');
  const { uris: screenshotsUris, status: screenshotsStatus } =
    useCleanerAlbum('screenshots');
  const { uris: blurryUris, status: blurryPhotosStatus } =
    useCleanerAlbum('blurryPhotos');
  const { uris: similarUris, status: similarPhotosStatus } =
    useCleanerAlbum('similarPhotos');
  const { uris: selfiesUris, status: selfiesStatus } =
    useCleanerAlbum('selfies');
  const { uris: liveUris, status: livePhotosStatus } =
    useCleanerAlbum('livePhotos');

  const statuses = [
    screenshotsStatus,
    blurryPhotosStatus,
    similarPhotosStatus,
    selfiesStatus,
    livePhotosStatus,
  ];

  const isLoading = statuses.some((s) => s === 'loading');

  const foundCount =
    (Array.isArray(similarUris?.[0])
      ? (similarUris as any[]).flat().length
      : (similarUris?.length ?? 0)) +
    (screenshotsUris?.length ?? 0) +
    (blurryUris?.length ?? 0) +
    (selfiesUris?.length ?? 0) +
    (liveUris?.length ?? 0);

  const READY_MIN = 1000;
  const disabled = isLoading && foundCount < READY_MIN;

  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      setDots(1);
      return;
    }
    const id = setInterval(() => setDots((d) => (d % 3) + 1), 450);
    return () => clearInterval(id);
  }, [isLoading]);

  const neverCleaned = !lastCleaned;

  const buttonColor = disabled
    ? '#26B13C'
    : neverCleaned
      ? '#FF6767'
      : '#26B13C';

  return (
    <Pressable
      disabled={disabled}
      onPress={premiumAction(() => openModal('FastCleanModal'))}
      style={{ backgroundColor: buttonColor }}
      className="mt-4 h-15 flex-row items-center justify-center rounded-2xl"
    >
      <UiText className="text-xl font-medium color-white">
        {disabled
          ? t('cleaner.widget.processing...')
          : t('cleaner.widget.start-smart-clean')}
      </UiText>

      {disabled && (
        <UiText className="w-5 text-xl font-medium color-white">
          {'.'.repeat(dots)}
        </UiText>
      )}
    </Pressable>
  );
}

const SEG_DURATION = 550;
const SEG_DELAY_STEP = 110;

type AlbumKey =
  | 'similarPhotos'
  | 'screenshots'
  | 'blurryPhotos'
  | 'selfies'
  | 'livePhotos';

type SegmentProps = {
  barWidth: number;
  percent: number;
  index: number;
  isLast: boolean;
  color: string;
};

function ProgressSegment({
  barWidth,
  percent,
  index,
  isLast,
  color,
}: SegmentProps) {
  const k = useSharedValue(0);

  useEffect(() => {
    k.value = 0;
    k.value = withDelay(
      index * SEG_DELAY_STEP,
      withTiming(1, {
        duration: SEG_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [index, barWidth, percent]);

  const rStyle = useAnimatedStyle(() => {
    return {
      width: barWidth * percent * k.value,
    };
  }, [barWidth, percent]);

  return (
    <Animated.View
      style={[
        {
          height: '100%',
          backgroundColor: color,
          borderRightWidth: isLast ? 0 : 1,
          borderRightColor: '#F3F3F3',
        },
        rStyle,
      ]}
    />
  );
}

function CategoryProgressBar() {
  const { t } = useTranslation();
  const { items } = useTotalUsage();

  const albums = useMemo(
    () =>
      [
        {
          key: 'similarPhotos',
          count: items.similarPhotos.items.flat().length,
        },
        { key: 'screenshots', count: items.screenshots.items.length },
        { key: 'blurryPhotos', count: items.blurryPhotos.items.length },
        { key: 'selfies', count: items.selfies.items.length },
        { key: 'livePhotos', count: items.livePhotos.items.length },
      ] as const,
    [items, t]
  );

  const total = albums.reduce((acc, a) => acc + a.count, 0);

  const normalizedAlbums = useMemo(() => {
    if (!total) return [];
    const withMin = albums.map((a) => ({
      ...a,
      percent: Math.max(a.count / total, MIN_PERCENT),
    }));
    const sum = withMin.reduce((acc, a) => acc + a.percent, 0);
    return withMin.map((a) => ({ ...a, percent: a.percent / sum }));
  }, [albums, total]);

  const [barWidth, setBarWidth] = useState(0);

  return (
    <View>
      <View
        className="overflow-hidden rounded-full bg-[#F3F3F3]"
        style={{ height: scaleY(19) }}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        {barWidth > 0 && (
          <View style={{ height: '100%', flexDirection: 'row' }}>
            {normalizedAlbums.map((a, index) => (
              <ProgressSegment
                key={a.key}
                barWidth={barWidth}
                percent={a.percent}
                index={index}
                isLast={index === normalizedAlbums.length - 1}
                color={ALBUM_COLORS[a.key as AlbumKey]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
