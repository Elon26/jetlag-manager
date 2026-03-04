import {
  type IAPSubscription,
  useLocale,
  usePurchases,
} from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import bg_gallery from '@/images/paywall/bg.png';
import icons_cleaner from '@/images/paywall/icons.png';
import loader from '@/images/paywall/loader.png';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';

import { shadows } from '@/config/theme/shadows';
import ProgressBar from './components/progress-bar';
import { PaywallFooter } from './paywall-footer';
import { PaywallHeader } from './paywall-header';

export function PaywallPW3() {
  const { t } = useTranslation();
  const { closeModal } = useModals();
  const { subscriptions = [], purchaseProduct } = usePurchases();
  const { formatPrice, formatPeriod } = useLocale();
  const setIsFirstShowPaywall = useSetStorage('isFirstShowPaywall');
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<IAPSubscription | null>(null);
  const sortedSubscriptions = useMemo(
    () => [...subscriptions].sort((a, b) => a.price - b.price),
    [subscriptions]
  );
  useEffect(() => {
    if (sortedSubscriptions.length) {
      setSelectedSubscription(sortedSubscriptions[0]);
    }
  }, [sortedSubscriptions]);

  const subscribeButtonLabel = useMemo(() => {
    if (!selectedSubscription) return '';
    const price = formatPrice(
      selectedSubscription.price,
      selectedSubscription.currency
    );
    const period = formatPeriod(
      selectedSubscription.periodUnit,
      selectedSubscription.numberOfPeriods
    );

    if (selectedSubscription.trial) {
      return t('paywall.pw3.subscribe-with-trial-button');
    }
    return t('paywall.pw3.subscribe-without-trial-button', { price, period });
  }, [selectedSubscription, formatPrice, formatPeriod, t]);

  const description = useMemo(() => {
    if (!selectedSubscription) return '';
    const price = formatPrice(
      selectedSubscription.price,
      selectedSubscription.currency
    );
    const period = formatPeriod(
      selectedSubscription.periodUnit,
      selectedSubscription.numberOfPeriods
    );

    if (selectedSubscription.trial) {
      const trial = formatPeriod(
        selectedSubscription.trial.periodUnit,
        selectedSubscription.trial.numberOfPeriods
      );
      return t('paywall.pw3.description-with-trial', { trial, price, period });
    }
  }, [selectedSubscription, formatPrice, formatPeriod, t]);

  const handleSubscribe = async () => {
    if (!selectedSubscription) return;
    setIsLoading(true);
    setIsFirstShowPaywall(true);
    try {
      await purchaseProduct(selectedSubscription.id);
      closeModal('Paywall');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="flex-1 items-center bg-secondary">
      <MotiView
        from={{
          opacity: 0,
          scale: 1.08,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 1.05,
        }}
        transition={{
          opacity: { type: 'timing', duration: 500 },
          scale: {
            type: 'timing',
            duration: 700,
            easing: Easing.out(Easing.cubic),
          },
          delay: 80,
        }}
        style={{ position: 'absolute' }}
      >
        <Image
          contentFit="cover"
          contentPosition="center"
          source={bg_gallery}
          style={{ width: scaleX(375), height: scaleY(800) }}
        />
      </MotiView>
      <MotiView
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 0 }}
        from={{ opacity: 0, translateY: -1000 }}
        style={{ position: 'absolute', top: scaleY(210) }}
        transition={{
          opacity: { type: 'timing', duration: 500, delay: 30 },
          translateY: {
            type: 'spring',
            damping: 15,
            stiffness: 180,
            mass: 0.7,
            delay: 150,
          },
        }}
      >
        <Image
          contentFit="cover"
          contentPosition="center"
          source={icons_cleaner}
          style={{ width: scaleX(375), height: scaleX(216) }}
        />
      </MotiView>
      <MotiView
        from={{
          opacity: 0,
          translateY: 300,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          translateY: 150,
          scale: 0.95,
        }}
        transition={{
          delay: 500,
          translateY: {
            type: 'spring',
            damping: 12,
            stiffness: 150,
            mass: 0.8,
          },
          scale: {
            type: 'spring',
            damping: 15,
            stiffness: 160,
          },
          opacity: {
            type: 'timing',
            duration: 800,
            easing: Easing.out(Easing.cubic),
          },
        }}
        style={{
          position: 'absolute',
          top: scaleY(473),
          alignSelf: 'center',
        }}
      >
        <Image
          contentFit="cover"
          contentPosition="center"
          source={loader}
          style={{ width: scaleX(375), height: scaleX(120) }}
        />
        <View className="absolute left-8 top-4 " style={shadows.sm}>
          <ProgressBar />
        </View>

        <UiText className="absolute bottom-9 self-center text-2xl font-bold color-[#FE6464]">
          {t('paywall.pw3.storage-percentage')}{' '}
          <UiText className="text-1.5xl font-medium color-white">
            {t('paywall.pw3.storage-used')}
          </UiText>
        </UiText>
      </MotiView>
      <View className="w-full flex-1">
        <View
          style={{ paddingTop: insets.top - scaleY(14) }}
          className="-mt-1 rounded-b-3xl border border-[#EEEEEE] bg-primary px-4"
        >
          <PaywallHeader />
          <UiText
            style={{ marginTop: scaleY(18), marginBottom: scaleY(20) }}
            className="text-center text-1.5xl font-semibold color-white"
          >
            {t('paywall.pw3.title')}
          </UiText>
        </View>

        <View className="flex-1 justify-end px-4">
          <View style={{ paddingBottom: scaleY(35) }}>
            <View className="items-center">
              {selectedSubscription?.trial ? (
                <View className="items-center pb-3">
                  <UiText className="text-sm font-medium color-[#FFFFFF70]">
                    {t('paywall.pw3.no-upfront-payment')}
                  </UiText>
                  <UiText className="text-sm font-medium color-[#FFFFFF70]">
                    {description}
                  </UiText>
                  <UiText className="text-sm font-medium color-[#FFFFFF70]">
                    {t('paywall.pw3.cancel-anytime')}
                  </UiText>
                </View>
              ) : null}

              <View
                style={{
                  paddingBottom: scaleX(4),
                  paddingTop: scaleX(8),
                }}
              >
                <PaywallFooter />
              </View>
            </View>
            <ButtonPrimary
              className="h-14 rounded-2xl bg-white"
              disabled={!selectedSubscription || isLoading}
              loading={isLoading || !subscriptions.length}
              onPress={handleSubscribe}
            >
              <UiText className="font-semibold text-text">
                {subscribeButtonLabel}
              </UiText>
            </ButtonPrimary>
          </View>
        </View>
      </View>
    </View>
  );
}
