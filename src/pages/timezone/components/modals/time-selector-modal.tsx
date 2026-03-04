import { scaleX, scaleY } from '@kirz/nativewind-scale';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalStackParams } from '@/components/modals';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

export function TimeSelectorModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'TimeSelectorModal'>) {
  const close = () => params?.close();
  const selectedTime = params?.selectedTime;
  const type = params?.type;
  const select = () => params?.select(currentTime);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState<Date>(
    selectedTime || new Date()
  );

  function handleChangeCurrentTime(e: DateTimePickerEvent) {
    setCurrentTime(new Date(e.nativeEvent.timestamp));
  }

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
          <DateTimePicker
            value={currentTime}
            mode={type}
            display="spinner"
            onChange={handleChangeCurrentTime}
            themeVariant="light"
            textColor="black"
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
