import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { MotiView, View } from 'moti';
import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalStackParams } from '@/components/modals';
import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import CupImage from '@/images/gallery-organiser/cup.png';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';

type CleanerHappyModalProps = ModalComponentProp<
  ModalStackParams,
  void,
  'CleanerHappyModal'
>;

export function CleanerHappyModal({ modal }: CleanerHappyModalProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { review_trigger } = useConfig();
  const { openModal } = useModals();

  const cleanSuccessCount = useStorageValue('cleanSuccessCount');
  const setCleanSuccessCount = useSetStorage('cleanSuccessCount');

  const handleClose = useCallback(() => {
    const shouldHandleReview = review_trigger === 'b';
    const current = cleanSuccessCount ?? 0;
    const next = current + 1;
    const shouldShowRateModal =
      shouldHandleReview && (next === 1 || next % 10 === 0);

    if (shouldHandleReview) {
      setCleanSuccessCount(next);
    }
    modal.closeModal('CleanerHappyModal', () => {
      if (shouldShowRateModal) {
        setTimeout(() => {
          openModal('RateModal');
        }, 300);
      }
    });
  }, [
    review_trigger,
    cleanSuccessCount,
    setCleanSuccessCount,
    openModal,
    modal,
  ]);

  return (
    <View className="flex-1 bg-white" style={{ width, height }}>
      <MotiView
        className="z-20 flex-1"
        from={{ opacity: 0, translateY: scaleY(120), scale: 1.05 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          opacity: {
            type: 'timing',
            duration: 1000,
            easing: Easing.out(Easing.cubic),
          },
          translateY: {
            type: 'timing',
            duration: 1000,
            easing: Easing.out(Easing.cubic),
          },
          scale: {
            type: 'timing',
            duration: 1000,
            easing: Easing.out(Easing.cubic),
          },
        }}
      >
        <View className="flex-1 items-center justify-between bg-white p-4">
          <View className="w-full flex-1 items-center pt-10">
            <Image
              source={CupImage}
              contentFit="cover"
              contentPosition="center"
              style={{
                width: scaleX(315),
                height: scaleX(280),
                marginTop: insets.top,
              }}
            />

            <View className="pb-9" style={{ marginTop: scaleY(79) }}>
              <UiText className="mb-3 text-center text-3.5xl font-semibold text-text">
                Great work!
              </UiText>

              <UiText className="text-center text-lg font-medium text-text">
                You've cleaned
              </UiText>

              <View className="items-center pt-2">
                {modal.params?.children}
              </View>
            </View>
          </View>

          <View className="absolute inset-x-0 bottom-0 rounded-3xl border border-[#EEEEEE] bg-white px-5 pb-13 pt-6">
            <ButtonPrimary
              className="h-14 w-full rounded-xl"
              label="Start Compact"
              onPress={handleClose}
            />
          </View>
        </View>
      </MotiView>
    </View>
  );
}
