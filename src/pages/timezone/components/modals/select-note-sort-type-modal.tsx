import { scaleX } from '@kirz/nativewind-scale';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalStackParams } from '@/components/modals';
import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { UiText } from '@/ui/ui-text';

export function SelectNoteSortTypeModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'SelectNoteSortTypeModal'>) {
  const sortNotes = (currentSortType: string) =>
    params?.sortNotes(currentSortType);
  const { closeModal } = useModals();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const sortTypes = [
    { value: 'byType', label: t('timezone.by-type') },
    { value: 'byTime', label: t('timezone.by-time') },
    { value: 'byChangeDate', label: t('timezone.by-change-date') },
    { value: 'byAddDate', label: t('timezone.by-add-date') },
    { value: 'fromAToZ', label: t('timezone.from-a-to-z') },
    { value: 'fromZToA', label: t('timezone.from-z-to-a') },
  ];

  return (
    <Pressable
      className="items-center"
      style={{
        width,
        height,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      onPress={() => closeModal('SelectNoteSortTypeModal')}
    >
      <View
        style={{
          width: width - scaleX(32),
        }}
      >
        <View
          className="absolute right-0 top-12 w-40 rounded-lg bg-white"
          style={shadows.md}
        >
          {sortTypes.map((sortType, index) => {
            const currentSortType = sortType.value;
            return (
              <Pressable
                key={currentSortType}
                onPress={() => sortNotes(currentSortType)}
              >
                {index !== 0 && <View className="h-px w-full bg-gray/20" />}
                <UiText className="mx-3.5 my-3 text-sm">
                  {sortType.label}
                </UiText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Pressable>
  );
}
