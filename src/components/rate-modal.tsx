import { usePurchases } from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { View } from 'moti';
import { useTranslation } from 'react-i18next';
import { Linking, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { usePaywall } from '@/hooks/use-paywall';
import { useStorageValue } from '@/hooks/use-storage';
import backgroundImage from '@/images/rate/bg.png';
import StarsImage from '@/images/rate/stars.png';
import CloseIcon from '@/svg/close-modal.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';
import { Env } from '@kirz/expo-env';

export function RateModal() {
  const { t } = useTranslation();
  const { review_trigger } = useConfig();
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;
  const { width, height } = useWindowDimensions();
  const { closeModal } = useModals();
  const { showPaywall } = usePaywall();
  const insets = useSafeAreaInsets();

  const handleRatePress = async () => {
    const url = `itms-apps://apps.apple.com/app/id${Env.APP_ID}?action=write-review`;
    try {
      await Linking.openURL(url);
    } catch {
      await Linking.openURL(`https://apps.apple.com/app/id${Env.APP_ID}`);
    }
  };

  return (
    <View
      className="flex-1"
      style={{
        width,
        height,
      }}
    >
      <Image
        source={backgroundImage}
        className="absolute inset-0"
        contentFit="cover"
      />
      <View className="flex-1 items-center justify-between p-4">
        <View className=" w-full flex-1 items-center">
          <Image
            contentFit="cover"
            contentPosition="center"
            source={StarsImage}
            style={{
              width: scaleX(375),
              height: scaleX(400),
              marginTop: insets.top + scaleY(80),

              position: 'absolute',
            }}
          />
          <TouchableOpacity
            style={{ top: insets.top }}
            className="absolute right-0"
            hitSlop={15}
            onPress={() => {
              closeModal('RateModal');
              if (!hasPremium && review_trigger === 'a') {
                setTimeout(() => {
                  showPaywall('onboarding');
                }, 300);
              }
            }}
          >
            <CloseIcon />
          </TouchableOpacity>
          <View
            style={{ marginTop: insets.top + scaleY(425) }}
            className="px-6"
          >
            <UiText className="mb-3 px-4 text-center text-4xl font-bold">
              {t('rate-modal.title')}
            </UiText>
            <UiText className="pt-5 text-center text-xl text-text">
              {t('rate-modal.description')}
            </UiText>
          </View>
        </View>
        <View
          className="absolute inset-x-0 bottom-0 rounded-3xl px-5"
          style={{ paddingBottom: insets.bottom + scaleY(40) }}
        >
          <ButtonPrimary
            className="h-12 w-full rounded-xl"
            label={t('rate-modal.continue-button')}
            labelClassName="text-lg font-semibold"
            onPress={handleRatePress}
          />
        </View>
      </View>
    </View>
  );
}
