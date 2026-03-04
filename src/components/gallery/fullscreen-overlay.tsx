import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { getAssetInfoAsync } from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import type { FullscreenViewOverlayComponentProps } from 'expo-simple-gallery';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/config/theme';
import { ButtonPrimary } from '@/ui/button-primary';
import { Checkbox } from '@/ui/checkbox';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { usePromise } from '@/utils/use-promise';

type FullscreenViewOverlayComponentPropsExtended =
  FullscreenViewOverlayComponentProps & {
    closeViewer?: () => void;
    setSelectionMode?: (selectionMode: boolean) => void;
    deleteByUri?: (uri: string) => Promise<boolean>;
  };

export function FullscreenViewOverlayComponent({
  closeViewer,
  selected,
  toggleSelection,
  setSelectionMode,
  uri,
  deleteByUri,
}: FullscreenViewOverlayComponentPropsExtended) {
  const { t } = useTranslation();
  const handleToggleSelection = () => {
    // setSelectionMode?.(true);
    toggleSelection();
  };
  const insets = useSafeAreaInsets();
  const asset = usePromise(getAssetInfoAsync(uri.replace('ph://', '')));

  return (
    <>
      <View
        style={{
          position: 'absolute',
          inset: 0,
          top: -100,
          bottom: 750,
          zIndex: 1,
          backgroundColor: colors.background.toString(),
        }}
      />
      <View
        className=" absolute inset-x-0 z-20 h-[44] flex-row items-center justify-between gap-5 px-4"
        pointerEvents="box-none"
        style={{
          top: insets.top,
        }}
      >
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => {
            closeViewer?.();
            setSelectionMode?.(false);
          }}
        >
          <SfSymbol
            className="size-4"
            name="chevron.left"
            tintColor={colors.text.toString()}
            weight="semibold"
          />
          <UiText adjustsFontSizeToFit className="text-1.5xl font-semibold">
            {t('cleaner.gallery-album.default-title')}
          </UiText>
        </TouchableOpacity>
        <Checkbox
          checked={selected}
          onChange={() => {
            handleToggleSelection();
          }}
        />
      </View>
      <View
        className="absolute inset-x-10 bottom-0 flex-row gap-2.5"
        pointerEvents="box-none"
        style={{ bottom: insets.bottom + 10 }}
      >
        <ButtonPrimary
          className="flex-1 bg-gray-400"
          label={t('secret-folder.gallery.context-menu.share')}
          labelClassName="text-text"
          onPress={async () => {
            impactAsync(ImpactFeedbackStyle.Medium);
            if (!asset?.localUri) {
              shareAsync(uri);
              return;
            }
            shareAsync(asset.localUri);
          }}
          style={{
            shadowColor: '#D6E0E8',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
          }}
        />
        <ButtonPrimary
          className="flex-1"
          label={t('cleaner.delete')}
          onPress={async () => {
            impactAsync(ImpactFeedbackStyle.Medium);
            closeViewer?.();
            deleteByUri?.(uri);
          }}
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}
        />
      </View>
    </>
  );
}
