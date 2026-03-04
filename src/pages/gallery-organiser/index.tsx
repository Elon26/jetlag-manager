import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { prettyBytes, useStorageUsage } from '@kirz/react-native-device-info';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import numbro from 'numbro';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { modalfy } from 'react-native-modalfy';

import { Layout } from '@/components/layout';
import { Loader } from '@/components/scan-loader';
import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { usePermissionAlert } from '@/hooks/use-permission-alert';
import { CameraRoll, CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import ArriwRightIcon from '@/svg/arrow-right-big.svg';
import BlurryIcon from '@/svg/gallery-organiser/blurry.svg';
import ScreenhotsIcon from '@/svg/gallery-organiser/screenshots.svg';
import SelfiesIcon from '@/svg/gallery-organiser/selfie.svg';
import {
  default as LivePhotosIcon,
  default as SimilarPhotosIcon,
} from '@/svg/gallery-organiser/similar-live.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';

import { useSetStorage } from '@/hooks/use-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { refetchAll, useAssets, useSelection } from './hooks/use-cleaner-album';
import {
  GalleryCleanerAlbum,
  GalleryCleanerAlbumStatus,
} from './hooks/use-cleaner-album/types';
import { useTotalUsage } from './hooks/use-total-usage';

export function GalleryOrganiser() {
  const { t } = useTranslation();
  const { items } = useTotalUsage();
  const { used, total } = useStorageUsage();
  const percentUsed = Math.round((used / total) * 100);
  const [showLoader, setShowLoader] = useState(true);
  usePermissionAlert(
    'ios.permission.PHOTO_LIBRARY',
    t('cleaner.gallery-organiser.permission-alert')
  );
  useEffect(() => {
    let cancelled = false;
    const checkPermissionsAndStatuses = async () => {
      try {
        const [{ status: photosStatus }] = await Promise.all([
          MediaLibrary.getPermissionsAsync(),
        ]);
        const photosDenied = photosStatus !== 'granted';
        const statuses = [
          photosDenied ? 'error' : items.screenshots.status,
          photosDenied ? 'error' : items.blurryPhotos.status,
          photosDenied ? 'error' : items.similarPhotos.status,
        ];
        const timeout = setTimeout(() => {
          if (!cancelled && showLoader) {
            setShowLoader(false);
          }
        }, 5000);
        const allLoading = statuses.every((s) => s === 'loading');
        const allDone = statuses.every((s) => s !== 'loading');
        if (allDone || !allLoading) {
          clearTimeout(timeout);
          if (!cancelled) setShowLoader(false);
        } else if (allLoading && !showLoader) {
          setShowLoader(true);
        }
        return () => clearTimeout(timeout);
      } catch {
        if (!cancelled) setShowLoader(false);
      }
    };
    checkPermissionsAndStatuses();
    return () => {
      cancelled = true;
    };
  }, [
    items.screenshots.status,
    items.blurryPhotos.status,
    items.similarPhotos.status,
    showLoader,
  ]);

  return (
    <Layout
      className="pb-safe-0 px-0"
      safeArea={false}
      scroll={showLoader ? false : true}
    >
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <View
            className="mx-4 gap-2 rounded-4.5xl bg-white p-3"
            style={[{ marginTop: scaleY(120) }, shadows.md]}
          >
            <View>
              <UiText className="font-semibold">
                {t('cleaner.gallery-organiser.title')}
              </UiText>
              <UiText className="pb-2 pt-1 text-sm text-[#9C9C9F]">
                {t('cleaner.gallery-organiser.description')}
              </UiText>
            </View>
            {(
              [
                [
                  t('cleaner.gallery-organiser.categories.similar-photos'),
                  items.similarPhotos.items.flat(),
                  items.similarPhotos.status,
                  'similarPhotos',
                  <SimilarPhotosIcon key="similar" />,
                ],
                [
                  t('cleaner.gallery-organiser.categories.screenshots'),
                  items.screenshots.items,
                  items.screenshots.status,
                  'screenshots',
                  <ScreenhotsIcon key="screenshots" />,
                ],
                [
                  t('cleaner.gallery-organiser.categories.blurry-photos'),
                  items.blurryPhotos.items,
                  items.blurryPhotos.status,
                  'blurryPhotos',
                  <BlurryIcon key="blurry" />,
                ],
                [
                  t('cleaner.gallery-organiser.categories.selfie'),
                  items.selfies.items,
                  items.selfies.status,
                  'selfies',
                  <SelfiesIcon key="selfies" />,
                ],
                [
                  t('cleaner.gallery-organiser.categories.live-photos'),
                  items.livePhotos.items,
                  items.livePhotos.status,
                  'livePhotos',
                  <LivePhotosIcon key="live" />,
                ],
              ] as const
            ).map(([title, uris, status, albumName, icon]) => (
              <CleanerGalleryRow
                albumName={albumName}
                key={albumName}
                status={status}
                title={title}
                uris={uris}
                icon={icon}
              />
            ))}
          </View>
          <View
            className="mx-4 rounded-2xl bg-white px-4"
            style={[
              { marginTop: scaleY(16), paddingVertical: scaleY(16) },
              shadows.md,
            ]}
          >
            <View
              style={{ marginBottom: scaleY(10) }}
              className=" flex-row items-center justify-between"
            >
              <UiText className="text-lg font-medium text-text">
                {t('cleaner.gallery-organiser.optimize.title')}
              </UiText>
              <UiText className="text-sm text-[#9C9C9F]">
                {t('cleaner.gallery-organiser.optimize.used-percentage.part1')}{' '}
                <UiText className="font-semibold text-[#FF6767]">
                  {percentUsed}%
                </UiText>{' '}
                {t('cleaner.gallery-organiser.optimize.used-percentage.part2')}
              </UiText>
            </View>
            <View />
            <View
              className="bg-red-100 mt-1  w-full overflow-hidden rounded-full bg-[#F5F5F5]"
              style={{ height: scaleY(26) }}
            >
              <LinearGradient
                colors={['#FFA2A2', '#FF6767']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${percentUsed}%`,
                  height: '100%',
                  borderRadius: 999,
                }}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: scaleY(30),
            }}
            className=" h-40 rounded-t-3xl border-l border-r border-t border-[#E7E7E7] bg-white px-4  pt-6"
          >
            <CleanButton />
          </View>
        </>
      )}
    </Layout>
  );
}

type CleanerGalleryRowProps = {
  title: string;
  uris: string[];
  status: GalleryCleanerAlbumStatus;
  albumName: GalleryCleanerAlbum;
  icon?: React.ReactNode;
};

function CleanerGalleryRow({
  title,
  uris,
  status,
  albumName,
  icon,
}: CleanerGalleryRowProps) {
  const { t } = useTranslation();
  const { isSelected, select, deselect } = useSelection();
  const ids = uris.map((uri) => uri.replace('ph://', ''));
  const assets = useAssets(ids);
  const size = ids.reduce((acc, ids) => acc + (assets?.[ids]?.size ?? 0), 0);
  const { logEvent } = useAnalytics();

  useEffect(() => {
    logEvent(`${albumName}`);
  }, [albumName, logEvent]);
  const isDisabled =
    uris.length === 0 || status === 'loading' || status === 'error';

  const isLoading = status === 'loading';
  return (
    <TouchableOpacity
      className="flex-row items-center gap-4 rounded-2xl bg-[#F5F5F5] px-4"
      disabled={isDisabled}
      onPress={() => {
        if (!isDisabled) {
          router.navigate({
            pathname: '/gallery-album',
            params: { folder: albumName, origin: 'smartCleaner' },
          });
        }
      }}
      style={{ height: scaleY(60) }}
    >
      <View className="w-35 flex-row gap-1">
        <View>
          <View className="flex-row">
            {icon && <View>{icon}</View>}
            <UiText className="pl-1 font-medium">{title}</UiText>
          </View>
          {isLoading ? (
            <UiText className="pl-5.5 text-xs text-gray">
              {t('cleaner.widget.scanning')}
            </UiText>
          ) : (
            <UiText className="pl-5.5 pt-1 text-xs lowercase text-gray">
              {uris.length} (
              {prettyBytes(size) === '-- MB'
                ? t('cleaner.common.zero-mb')
                : prettyBytes(size)}
              )
              <ArriwRightIcon className="pl-4" />
            </UiText>
          )}
        </View>
      </View>
      <View className="flex-1" />

      <Checkbox
        checked={isSelected(uris)}
        className="border-primary"
        disabled={isDisabled}
        onChange={(selected) => {
          if (selected) select(uris);
          else deselect(uris);
        }}
      />
    </TouchableOpacity>
  );
}

function CleanButton() {
  const { t } = useTranslation();
  const setLastCleaningTimestamp = useSetStorage('lastCleaningTimestamp');
  const { premiumAction } = usePaywall();
  const { openModal, closeModal } = useModals();

  const { clearSelection, selectedAssets } = useSelection();

  const deletedAssetsCountRef = useRef(0);
  const deletedAssetsSizeRef = useRef(0);

  const deleteByUri = async (uri: string | string[]) => {
    const urisArray = Array.isArray(uri) ? uri : [uri];
    const ids = urisArray.map((u) => u.replace('ph://', ''));
    try {
      const info = await CleanerGalleryApiV2.getDetails(ids);
      const { success } = await CameraRoll.deleteAssets(ids);
      if (success) {
        clearSelection();
        refetchAll();
        const size = info.reduce((acc, asset) => acc + (asset.size || 0), 0);
        deletedAssetsSizeRef.current = size;
        deletedAssetsCountRef.current = ids.length;
      } else {
        throw new Error(t('cleaner.gallery-organiser.clean-error.user-denied'));
      }
      return true;
    } catch {}
    return false;
  };

  const handleClean = async () => {
    if (!modalfy().currentModal) {
      openModal('LoaderModal');
    }
    if (selectedAssets.length > 0) {
      try {
        await deleteByUri(selectedAssets);
      } catch {}
    }

    closeModal('LoaderModal');

    const cleanedSizeString = numbro(deletedAssetsSizeRef.current).format({
      output: 'byte',
      base: 'decimal',
      mantissa: 1,
    });

    if (deletedAssetsCountRef.current > 0) {
      setLastCleaningTimestamp(Date.now());

      openModal('CleanerHappyModal', {
        children: (
          <UiText className="text-center text-gray">
            <UiText className="text-center font-medium text-primary">
              {deletedAssetsCountRef.current}{' '}
              {t('cleaner.gallery-organiser.clean-success.files')}{' '}
            </UiText>
            {t('cleaner.gallery-organiser.clean-success.message_1')}{' '}
            <UiText className="text-center font-medium text-primary">
              {cleanedSizeString}{' '}
            </UiText>
            {t('cleaner.gallery-organiser.clean-success.message_2')}
          </UiText>
        ),
      });
    }

    deletedAssetsSizeRef.current = 0;
    deletedAssetsCountRef.current = 0;
  };

  return (
    <ButtonPrimary
      className="h-14"
      disabled={selectedAssets.length === 0}
      label={t('cleaner.gallery-organiser.clean-button')}
      onPress={premiumAction(handleClean)}
      style={shadows.lg}
    />
  );
}
