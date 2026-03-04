import { scaleX } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, useWindowDimensions, View } from 'react-native';
import { ModalComponentProp } from 'react-native-modalfy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalStackParams } from '@/components/modals';
import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorage } from '@/hooks/use-storage';
import CloseIcon from '@/svg/close.svg';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import Palette from '../../types/palette';
import { Timezone } from '../../types/timezone';
import { ColorSelector } from '../color-selector';
import { PrioritySelector } from '../priority-selector';
import { TimezoneSelector } from '../timezone-selector';

export function EditTimezoneModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'EditTimezoneModal'>) {
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const [savedTimezones, setSavedTimezones] = useStorage('savedTimezones');
  const timezoneObjId = params?.timezoneObjId;
  const currentTimezoneObj = savedTimezones.find(
    (timezoneObj) => timezoneObj.id === timezoneObjId
  );
  const close = () => params?.close();
  const maxPriority = savedTimezones.length;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [selectedTimezone, setSelectedTimezone] = useState<null | Timezone>(
    currentTimezoneObj?.timezone || null
  );
  const [error, setError] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(
    currentTimezoneObj?.priority || 1
  );
  const [selectedColor, setSelectedColor] = useState<Palette>(
    currentTimezoneObj?.color ||
      (hasPremium ? Palette.lightGreen : Palette.gray)
  );
  const [windowHeight, setWindowHeight] = useState(height);

  function handleEdit() {
    if (!selectedTimezone) {
      setError(t('timezone.select-country'));
      return;
    }
    if (!hasPremium && selectedColor !== Palette.gray) {
      showPaywall();
      setSelectedColor(Palette.gray);
      return;
    }
    const updatedTimezoneObj = {
      id: currentTimezoneObj?.id || uuid(),
      timezone: selectedTimezone,
      priority: selectedPriority,
      color: selectedColor,
      isFirst: currentTimezoneObj?.isFirst || false,
    };

    const updatedTimezones = savedTimezones.map((tz) =>
      tz.id === timezoneObjId ? updatedTimezoneObj : tz
    );

    let updatedTimezonesWithChangedPriority = [...updatedTimezones];
    if (selectedPriority !== currentTimezoneObj?.priority) {
      const timezonesToHandle = [...updatedTimezones];
      const filtered = timezonesToHandle.filter(
        (i) => i.id !== updatedTimezoneObj.id
      );
      filtered.splice(updatedTimezoneObj.priority - 1, 0, updatedTimezoneObj);
      updatedTimezonesWithChangedPriority = filtered.map((item, index) => ({
        ...item,
        priority: index + 1,
      }));
    }

    setSavedTimezones(updatedTimezonesWithChangedPriority);
    close();
  }

  function handleDelete() {
    const timezonesToHandle = [...savedTimezones];
    const filtered = timezonesToHandle.filter((i) => i.id !== timezoneObjId);
    const updatedTimezones = filtered.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));
    setSavedTimezones(updatedTimezones);
    close();
  }

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setWindowHeight(height - e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setWindowHeight(height);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <BlurView
      className="items-center justify-center"
      style={{
        width,
        height: windowHeight,
      }}
      tint="dark"
      intensity={30}
    >
      <View
        className="gap-y-8 rounded-xl bg-white px-5 pb-9 pt-12.5"
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
        <View className="gap-y-2">
          <TimezoneSelector
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
            error={error}
            setError={setError}
          />
          <View className="-mx-1 flex-row">
            <View className="w-1/2">
              <PrioritySelector
                selectedPriority={selectedPriority}
                setSelectedPriority={setSelectedPriority}
                maxPriority={maxPriority || 1}
              />
            </View>
            <View className="w-1/2">
              <ColorSelector
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            </View>
          </View>
        </View>
        <View className="items-center gap-y-2">
          <UiButton className="w-full rounded-xl" onPress={handleEdit}>
            <UiText className="text-xl font-semibold capitalize text-white">
              {t('basic.save')}
            </UiText>
          </UiButton>
          <UiButton
            className="w-full rounded-xl bg-gray/20"
            onPress={handleDelete}
          >
            <UiText className="text-xl font-semibold capitalize">
              {t('basic.delete')}
            </UiText>
          </UiButton>
        </View>
      </View>
    </BlurView>
  );
}
