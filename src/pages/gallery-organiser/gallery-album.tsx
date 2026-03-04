import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { getAssetInfoAsync } from 'expo-media-library';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import {
  type ExpoSimpleGalleryMethods,
  ExpoSimpleGalleryView,
} from 'expo-simple-gallery';
import numbro from 'numbro';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { difference } from 'remeda';

import { EmptyList } from '@/components/empty-list';
import { FullscreenViewOverlayComponent } from '@/components/gallery/fullscreen-overlay';
import { ThumbnailOverlayComponent } from '@/components/gallery/thumbnail-overlay';
import { Layout } from '@/components/layout';
import { Loader } from '@/components/scan-loader';
import { colors } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { usePermissionAlert } from '@/hooks/use-permission-alert';
import { CameraRoll, CleanerGalleryApiV2 } from '@/modules/cleaner-gallery';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';
import { assert } from '@/utils/assert';

import {
  refetchAll,
  useCleanerAlbum,
  useSelection,
} from './hooks/use-cleaner-album';
import {
  type GalleryCleanerAlbum,
  GalleryCleanerAvailableAlbums,
} from './hooks/use-cleaner-album/types';

export function GalleryAlbum() {
  const { t } = useTranslation();
  const { folder, origin } = useLocalSearchParams<{
    folder?: GalleryCleanerAlbum;
    origin?: 'smartCleaner';
  }>();

  const getFolderTitle = useCallback(
    (folder?: GalleryCleanerAlbum): string => {
      const titleMap: Record<GalleryCleanerAlbum, string> = {
        screenshots: t('cleaner.gallery-organiser.categories.screenshots'),
        selfies: t('cleaner.gallery-organiser.categories.selfie'),
        videos: t('cleaner.gallery-album.videos'),
        livePhotos: t('cleaner.gallery-organiser.categories.live-photos'),
        blurryPhotos: t('cleaner.gallery-organiser.categories.blurry-photos'),
        similarPhotos: t('cleaner.gallery-organiser.categories.similar-photos'),
      };

      if (folder && folder in titleMap) {
        return titleMap[folder];
      }

      return t('cleaner.gallery-album.default-title');
    },
    [t]
  );

  const { premiumAction } = usePaywall();

  const originSmartCleaner = origin === 'smartCleaner';
  assert(!!folder);
  assert(GalleryCleanerAvailableAlbums.includes(folder as GalleryCleanerAlbum));

  usePermissionAlert(
    'ios.permission.PHOTO_LIBRARY',
    t('cleaner.gallery-organiser.permission-alert')
  );

  const { openModal, closeModal } = useModals();
  const { uris, status } = useCleanerAlbum(folder);

  const { selectedAssets, setSelection, clearSelection, isSelected } =
    useSelection();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const galleryRef = useRef<ExpoSimpleGalleryMethods>(null);

  useEffect(() => {
    const albumTitle = getFolderTitle(folder as GalleryCleanerAlbum);

    navigation.setOptions({
      title: albumTitle,
      headerRight: () => (
        <Pressable
          className="w-16 items-end"
          onPress={() => {
            if (isSelected(uris.flat()) === true) {
              galleryRef.current?.setSelected([]);
              clearSelection();
            } else {
              const diff = difference(uris.flat(), selectedAssets);
              galleryRef.current?.setSelected([...selectedAssets, ...diff]);
            }
          }}
        >
          <UiText className="text-sm text-text">
            {isSelected(uris.flat()) === true
              ? t('timezone.cancel')
              : t('secret-folder.contacts.select-all')}
          </UiText>
        </Pressable>
      ),
    });
  }, [
    navigation,
    uris,
    selectedAssets,
    isSelected,
    clearSelection,
    folder,
    t,
    getFolderTitle,
  ]);

  useEffect(() => {
    if (originSmartCleaner) {
      return () => {};
    }
    clearSelection();
    return clearSelection;
  }, [clearSelection, originSmartCleaner]);

  const deleteByUri = premiumAction(async (uri: string | string[]) => {
    const urisArray = Array.isArray(uri) ? uri : [uri];
    openModal('CleaningModal');

    const ids = urisArray.map((u) => u.replace('ph://', ''));
    try {
      const info = await CleanerGalleryApiV2.getDetails(ids);
      const { success } = await CameraRoll.deleteAssets(ids);
      if (success) {
        galleryRef.current?.setSelected([]);
        clearSelection();
        refetchAll();
        const size = info.reduce((acc, asset) => acc + (asset.size || 0), 0);
        closeModal('CleaningModal');
        openModal('CleanerHappyModal', {
          children: (
            <>
              <UiText className="px-5 text-center text-gray">
                {t('cleaner.gallery-album.clean-success.message_1')}
              </UiText>
              <UiText className="px-5 text-center text-gray">
                {ids.length}{' '}
                {t('cleaner.gallery-album.clean-success.file', {
                  count: ids.length,
                })}
                {t('cleaner.gallery-album.clean-success.message_2')}{' '}
                {size ? (
                  <UiText className="font-semibold text-gray">
                    {numbro(size).format({
                      output: 'byte',
                      base: 'decimal',
                      mantissa: 1,
                    })}
                  </UiText>
                ) : (
                  t('cleaner.gallery-album.clean-success.some')
                )}{' '}
              </UiText>
            </>
          ),
        });
      } else {
        throw new Error(t('cleaner.gallery-organiser.clean-error.user-denied'));
      }
      return true;
    } catch {
      closeModal('CleaningModal');
    }
    return false;
  });

  const itemsLength = uris.flat().length;
  return (
    <Layout className="px-0">
      <UiText className="mt-1 px-5 text-sm text-text">
        {t('cleaner.gallery-album.files-count', { count: itemsLength })}
      </UiText>
      {status === 'loading' && <Loader />}
      {status !== 'loading' && !originSmartCleaner && (
        <View
          className=" mb-2 flex-row flex-wrap items-center gap-2 px-5  "
          style={{ marginTop: scaleY(5) }}
        />
      )}
      {status !== 'loading' && uris.length === 0 && (
        <EmptyList text={t('cleaner.gallery-album.empty-state')} />
      )}

      {status !== 'loading' && uris.length !== 0 && (
        <ExpoSimpleGalleryView
          assets={uris}
          columnsCount={3}
          contentContainerStyle={{
            paddingHorizontal: scaleX(16),
            paddingTop: scaleY(20),
            paddingBottom: insets.bottom + scaleY(164),
            gap: 3,
          }}
          contextMenuOptions={[
            {
              title: t('secret-folder.gallery.context-menu.open'),
              sfSymbol: 'arrowshape.turn.up.right',
              action: ({ index }) => galleryRef.current?.openImageViewer(index),
            },
            {
              title: t('secret-folder.gallery.context-menu.share'),
              sfSymbol: 'square.and.arrow.up',
              action: async ({ uri }) => {
                const asset = await getAssetInfoAsync(uri.replace('ph://', ''));
                if (!asset?.localUri) {
                  return;
                }
                shareAsync(asset.localUri);
              },
            },
            {
              title: t('cleaner.delete'),
              attributes: ['destructive'],
              sfSymbol: 'trash',
              action: async ({ uri }) => {
                deleteByUri(uri);
              },
            },
          ]}
          fullscreenViewOverlayComponent={(props) => (
            <FullscreenViewOverlayComponent
              {...props}
              closeViewer={galleryRef.current?.closeImageViewer}
              deleteByUri={deleteByUri}
            />
          )}
          fullscreenViewOverlayStyle={{
            backgroundColor: colors.background.toString(),
          }}
          initiallySelected={selectedAssets}
          onSelectionChange={({ nativeEvent: { selected } }) => {
            setSelection(selected);
          }}
          ref={galleryRef}
          sectionHeaderComponent={(props) => {
            const item = uris[props.index];
            const groupAssets: string[] = Array.isArray(item) ? item : [item];

            const allSelected = groupAssets.every((uri: string) =>
              selectedAssets.includes(uri)
            );

            return (
              <View className="mx-4 mt-3 h-10 flex-row items-center justify-between rounded-xl ">
                <UiText className="text-sm color-gray">
                  {t('cleaner.gallery-album.similar-photos-count', {
                    count: groupAssets.length,
                  })}
                </UiText>
                <Pressable
                  className="rounded-xl "
                  onPress={() => {
                    if (allSelected) {
                      galleryRef.current?.setSelected(
                        selectedAssets.filter((s) => !groupAssets.includes(s))
                      );
                    } else {
                      galleryRef.current?.setSelected([
                        ...new Set([...selectedAssets, ...groupAssets]),
                      ]);
                    }
                  }}
                >
                  <UiText className="text-sm  color-primary">
                    {allSelected
                      ? t('timezone.cancel')
                      : t('cleaner.gallery-album.select-all-group')}
                  </UiText>
                </Pressable>
              </View>
            );
          }}
          sectionHeaderStyle={{ height: scaleY(64) }}
          showMediaTypeIcon={false}
          style={{ flex: 1 }}
          thumbnailLongPressAction="preview"
          thumbnailOverlayComponent={ThumbnailOverlayComponent}
          thumbnailPanAction="select"
          thumbnailPressAction="select"
          thumbnailStyle={{
            borderRadius: scaleX(4),
          }}
          viewer="SwiftUI"
        />
      )}

      <View className="absolute inset-x-0 bottom-0 rounded-3xl border border-[#EEEEEE] bg-white px-5 pb-8 pt-6">
        <ButtonPrimary
          className="h-14 flex-1"
          label={t('cleaner.gallery-album.continue-button')}
          disabled={selectedAssets.length === 0}
          onPress={async () => {
            if (selectedAssets.length === 0) {
              return;
            }
            impactAsync(ImpactFeedbackStyle.Medium);
            if (originSmartCleaner) {
              router.back();
            } else {
              await deleteByUri(selectedAssets);
            }
          }}
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}
        />
      </View>
    </Layout>
  );
}
