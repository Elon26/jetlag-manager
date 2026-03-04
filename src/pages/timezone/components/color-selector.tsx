import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import TriangleDown from '@/svg/time-zone/triangle-down.svg';
import { UiText } from '@/ui/ui-text';

import Palette from '../types/palette';

type ColorSelectorProps = {
  selectedColor: Palette;
  setSelectedColor: Dispatch<SetStateAction<Palette>>;
};

export function ColorSelector({
  selectedColor,
  setSelectedColor,
}: ColorSelectorProps) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModals();

  return (
    <Pressable
      className="mx-1 h-13 flex-row items-center justify-between gap-x-1 rounded-xl bg-white px-2"
      style={shadows.md}
      onPress={() =>
        openModal('ColorSelectorModal', {
          select: (selectedColor) => {
            setSelectedColor(selectedColor);
            closeModal('ColorSelectorModal');
          },
          close: () => closeModal('ColorSelectorModal'),
          selectedColor: selectedColor,
        })
      }
    >
      <UiText className="text-gray">{t('timezone.color')}</UiText>
      <View className="flex-1 flex-row items-center justify-center gap-x-3">
        <View
          className="size-5"
          style={{ backgroundColor: selectedColor, borderRadius: 4 }}
        />
        <TriangleDown />
      </View>
    </Pressable>
  );
}
