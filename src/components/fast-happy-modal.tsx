import { scaleY } from '@kirz/nativewind-scale';
import { MotiView, View } from 'moti';
import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';

import type { ModalStackParams } from './modals';

type FastHappyModalProps = ModalComponentProp<
  ModalStackParams,
  void,
  'FastHappyModal'
>;

export function FastHappyModal({ modal }: FastHappyModalProps) {
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

    modal.closeModal('FastHappyModal', () => {
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
    <View
      className="items-center justify-center"
      style={{
        width,
        height,
        paddingBottom: insets.bottom + scaleY(10),
      }}
    >
      <MotiView
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        className="z-20 w-[91%]"
        from={{ opacity: 0, translateY: scaleY(120), scale: 1.05 }}
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
        <View className="rounded-3xl bg-white px-6 py-10">
          <View className="pb-9">
            <UiText className="mb-3 text-center text-3.5xl font-semibold text-text">
              Great work!
            </UiText>
            <UiText className="text-center text-lg font-medium text-text">
              You've cleaned
            </UiText>
            <View className="items-center pt-2">{modal.params?.children}</View>
          </View>

          <View className="inset-x-0 rounded-3xl">
            <ButtonPrimary
              className="h-14 w-full rounded-xl"
              label="Continue"
              onPress={handleClose}
            />
          </View>
        </View>
      </MotiView>
    </View>
  );
}
