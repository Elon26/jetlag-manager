import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalStackParams } from '@/components/modals';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import Palette from '../../types/palette';

const paletteArray = [
  { name: 'lightOrange', code: '#FDC60A' },
  { name: 'orange', code: '#F28E1C' },
  { name: 'darkOrange', code: '#E96220' },
  { name: 'red', code: '#E32322' },
  { name: 'lightPurple', code: '#C5037D' },
  { name: 'darkPurple', code: '#6D398B' },
  { name: 'purple', code: '#454E99' },
  { name: 'blue', code: '#2A71AF' },
  { name: 'lightblue', code: '#0696BB' },
  { name: 'green', code: '#008F5A' },
  { name: 'lightGreen', code: '#8DBB25' },
  { name: 'yellow', code: '#E5DD00' },
];

export function ColorSelectorModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'ColorSelectorModal'>) {
  const select = () => params?.select(currentColor);
  const close = () => params?.close();
  const selectedColor = params?.selectedColor;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [currentColor, setCurrentColor] = useState<Palette>(
    selectedColor || Palette.lightGreen
  );

  const data = paletteArray.map((item) => {
    const isSelected = item.code === currentColor;

    const baseRadius = 160;
    const baseInnerRadius = 100;
    const shift = 6;

    return {
      value: 1,
      color: item.code,
      strokeColor: isSelected ? 'black' : 'transparent',
      strokeWidth: isSelected ? 0 : 0,
      radius: isSelected ? baseRadius + shift : baseRadius,
      innerRadius: isSelected ? baseInnerRadius - shift : baseInnerRadius,
      onPress: () => setCurrentColor(item.code as Palette),
    };
  });

  return (
    <BlurView
      className="items-center justify-center"
      style={{
        width,
        height,
        paddingBottom: insets.bottom + scaleY(10),
      }}
      tint="dark"
      intensity={30}
    >
      <View
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5 "
        style={{
          width: width - scaleX(32),
        }}
      >
        <Pressable
          className="absolute right-2 top-2 size-10 items-center justify-center"
          onPress={close}
        >
          <CloseIcon />
        </Pressable>
        <View className="items-center justify-center">
          <PieChart
            donut
            showText={false}
            innerRadius={100}
            radius={160}
            data={data}
          />
          <View
            className="absolute size-20 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
        </View>
        <View className="items-center">
          <UiButton className="w-full rounded-xl" onPress={select}>
            <UiText className="text-xl font-semibold capitalize text-white">
              {t('basic.select')}
            </UiText>
          </UiButton>
        </View>
      </View>
    </BlurView>
  );
}
