import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import * as FileSystem from 'expo-file-system';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import {
  type ExpoSimpleGalleryMethods,
  ExpoSimpleGalleryView,
} from 'expo-simple-gallery';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyList } from '@/components/empty-list';
import { FullscreenViewOverlayComponent } from '@/components/gallery/fullscreen-overlay';
import { ThumbnailOverlayComponent } from '@/components/gallery/thumbnail-overlay';
import { Layout } from '@/components/layout';
import { colors } from '@/config/theme';
import { usePaywall } from '@/hooks/use-paywall';
import { useSheetPrompt } from '@/hooks/use-sheet-prompt';
import EmptyPhotos from '@/images/secret-folder/empty-photos.png';
import { ButtonPrimary } from '@/ui/button-primary';
import { isNotNullOrUndefined } from '@/utils/array';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { HeaderMenu } from './components/header-menu';
import { useSecretFolderGallery } from './hooks/use-secret-folder-gallery';
import type { SecretFolderAsset } from './hooks/use-secret-folder-gallery/atom';

const FREE_LIMIT = 1;

export function SecretGallery() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();

  const {
    prompt: promptDeleteAfterImport,
    SheetPromptComponent: SheetPromptComponentDeleteAfterImport,
  } = useSheetPrompt({
    title: t('secret-folder.gallery.delete-after-import.title'),
    description: t('secret-folder.gallery.delete-after-import.description'),
    actions: [{ label: t('cleaner.delete'), value: true }],
    cancelLabel: t('timezone.later'),
  });

  const {
    prompt: promptRestoreAfterDelete,
    SheetPromptComponent: SheetPromptComponentRestore,
  } = useSheetPrompt({
    title: t('secret-folder.gallery.confirm-delete.title'),
    description: t('secret-folder.gallery.confirm-delete.description'),
    actions: [{ label: t('cleaner.delete'), value: false }],
  });

  const { assets, addAssets, deleteAssets } = useSecretFolderGallery({
    sort: 'DESC',
    removeAfterImportPrompt: promptDeleteAfterImport,
    restoreAfterDeletePrompt: promptRestoreAfterDelete,
  });
  const limit = hasPremium
    ? undefined
    : Math.max(FREE_LIMIT - assets.length, 0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAssets, setSelected] = useState<SecretFolderAsset[]>([]);

  const [adding, setAdding] = useState(false);

  const { logEvent } = useAnalytics();
  useEffect(() => {
    logEvent('secret_gallery_screen');
  }, [logEvent]);

  const galleryRef = useRef<ExpoSimpleGalleryMethods>(null);

  const uris = useMemo(() => {
    return (
      assets
        ?.map(
          ({ uri, originalUri }: SecretFolderAsset) =>
            `${FileSystem.documentDirectory}${originalUri ?? uri}`
        )
        .filter((uri): uri is string => uri !== undefined) ?? []
    );
  }, [assets]);

  const getAssetByUri = useMemo(() => {
    return (uri: string) => {
      const relativeUri = uri.split('/').pop();
      return assets.find((a) => a.originalUri?.endsWith(relativeUri ?? ''));
    };
  }, [assets]);

  const galleryProps = useMemo(() => {
    const baseProps = {
      assets: uris,
      columnsCount: 3,
      contentContainerStyle: {
        paddingTop: scaleY(20),
        paddingBottom: scaleY(186),
        gap: 3,
      },
      contextMenuOptions: [
        {
          title: t('secret-folder.gallery.context-menu.open'),
          sfSymbol: 'arrowshape.turn.up.right',
          action: ({ index }: { index: number }) =>
            galleryRef.current?.openImageViewer(index),
        },
        {
          title: t('secret-folder.gallery.context-menu.share'),
          sfSymbol: 'square.and.arrow.up',
          action: async ({ uri }: { uri: string }) => {
            await shareAsync(uri);
          },
        },
        {
          title: t('cleaner.delete'),
          attributes: ['destructive'],
          sfSymbol: 'trash',
          action: async ({ uri }: { uri: string }) => {
            const foundAsset = getAssetByUri(uri);
            if (!foundAsset) return false;
            await deleteAssets([foundAsset.id]);
            return true;
          },
        },
      ],
      fullscreenViewOverlayComponent: (props: any) => (
        <FullscreenViewOverlayComponent
          {...props}
          closeViewer={galleryRef.current?.closeImageViewer}
          deleteByUri={async (uri: string) => {
            const foundAsset = getAssetByUri(uri);
            if (!foundAsset) return false;
            await deleteAssets([foundAsset.id]);
            return true;
          }}
          setSelectionMode={setSelectionMode}
        />
      ),
      thumbnailPressAction: 'select',

      fullscreenViewOverlayStyle: {
        backgroundColor: colors.background.toString(),
      },
      onSelectionChange: ({
        nativeEvent: { selected },
      }: {
        nativeEvent: { selected: string[] };
      }) => {
        const selectedAssets = selected
          .map((uri: string) => getAssetByUri(uri))
          .filter(isNotNullOrUndefined);
        setSelected(selectedAssets);
      },
      ref: galleryRef,
      style: { flex: 1 },
      thumbnailLongPressAction: selectionMode ? 'none' : 'preview',
      thumbnailStyle: { borderRadius: scaleX(16) },
    };

    return baseProps;
  }, [uris, getAssetByUri, deleteAssets, setSelectionMode, t]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderMenu
          selectionMode={selectionMode}
          isNoneSelected={selectedAssets.length === 0}
          isAllSelected={
            uris.length > 0 && selectedAssets.length === uris.length
          }
          onSelect={() => {
            if (!uris.length) return;
            setSelectionMode(true);
          }}
          onSelectAll={() => {
            if (!uris.length) return;

            setSelectionMode(true);
            requestAnimationFrame(() => {
              galleryRef.current?.setSelected(uris);
            });
          }}
          onUnselectAll={() => {
            galleryRef.current?.setSelected([]);
            setSelected([]);
            setSelectionMode(false);
          }}
        />
      ),
    });
  }, [navigation, uris, selectedAssets, selectionMode]);

  return (
    <Layout className="bg-[#F5F5F5] px-4">
      <View
        style={{ height: scaleY(110) }}
        className="absolute inset-x-0 bg-white"
      />
      {uris.length === 0 && (
        <EmptyList
          text={t('secret-folder.gallery.empty-state')}
          image={EmptyPhotos}
        />
      )}
      {uris.length !== 0 && (
        <ExpoSimpleGalleryView
          {...galleryProps}
          thumbnailOverlayComponent={
            selectionMode ? ThumbnailOverlayComponent : undefined
          }
        />
      )}
      <View className="absolute inset-x-0 bottom-0 rounded-3xl border border-[#EEEEEE] bg-white px-5 pb-13 pt-6">
        {selectionMode ? (
          <ButtonPrimary
            className="h-14 flex-1"
            disabled={adding || selectedAssets.length === 0}
            label={t('cleaner.delete')}
            loading={adding}
            onPress={async () => {
              impactAsync(ImpactFeedbackStyle.Medium);
              if (selectedAssets.length === 0) {
                return;
              }
              try {
                setAdding(true);
                const ids = selectedAssets.map((asset) => asset.id);
                await deleteAssets(ids);
                galleryRef.current?.setSelected([]);
                setSelectionMode(false);
              } finally {
                setAdding(false);
              }
            }}
            style={{
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            }}
          />
        ) : (
          <ButtonPrimary
            disabled={adding}
            label={t('secret-folder.gallery.add-photo-button')}
            loading={adding}
            onPress={async () => {
              impactAsync(ImpactFeedbackStyle.Medium);
              setAdding(true);
              addAssets(limit)
                .then((result) => {
                  if (result?.error === 'limit exceeded') {
                    showPaywall();
                  }
                })
                .finally(() => setAdding(false));
            }}
            className="h-14"
            style={{
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            }}
          />
        )}
      </View>
      <SheetPromptComponentDeleteAfterImport />
      <SheetPromptComponentRestore />
    </Layout>
  );
}
