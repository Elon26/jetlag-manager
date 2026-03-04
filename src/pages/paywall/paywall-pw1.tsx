import {
  type IAPSubscription,
  useLocale,
  usePurchases,
} from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import DoneIcon from '@/svg/paywall/done.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';
import { daysInProduct } from '@/utils/paywall';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { PaywallFooter } from './paywall-footer';
import { PaywallHeader } from './paywall-header';

export function PaywallPW1() {
  const { t } = useTranslation();
  const { closeModal } = useModals();
  const { subscriptions = [], purchaseProduct } = usePurchases();
  const { formatPrice, formatPeriod } = useLocale();
  const setIsFirstShowPaywall = useSetStorage('isFirstShowPaywall');

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
      const trial = formatPeriod(
        selectedSubscription.trial.periodUnit,
        selectedSubscription.trial.numberOfPeriods
      );
      return t('paywall.pw1.subscribe-with-trial', { trial, price, period });
    }
    return t('paywall.pw1.subscribe-without-trial', { price, period });
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
    <View className="flex-1 items-center bg-primary px-4 pb-2">
      <SafeAreaView className="w-full flex-1" edges={['top']}>
        <PaywallHeader />
        <UiText
          style={{ marginTop: scaleY(16), marginBottom: scaleY(20) }}
          className="text-center text-1.5xl font-semibold color-white"
        >
          {t('paywall.pw1.title')}
        </UiText>
        <SubSelector
          products={sortedSubscriptions}
          selected={selectedSubscription}
          onSelect={setSelectedSubscription}
        />
        <View>
          <UiText
            style={{ paddingVertical: scaleY(16) }}
            className="text-sm uppercase color-white"
          >
            {t('paywall.pw1.whats-included')}{' '}
            <UiText
              style={{ paddingVertical: scaleY(16) }}
              className="text-sm font-bold uppercase color-white"
            >
              {t('paywall.pw1.pro')}
            </UiText>
          </UiText>
          <FeatureList
            items={[
              [
                t('paywall.pw1.features.time-zone.title'),
                t('paywall.pw1.features.time-zone.description'),
              ],
              [
                t('paywall.pw1.features.note.title'),
                t('paywall.pw1.features.note.description'),
              ],
              [
                t('paywall.pw1.features.calendar.title'),
                t('paywall.pw1.features.calendar.description'),
              ],
              [
                t('paywall.pw1.features.gallery-boost.title'),
                t('paywall.pw1.features.gallery-boost.description'),
              ],
              [
                t('paywall.pw1.features.contacts-management.title'),
                t('paywall.pw1.features.contacts-management.description'),
              ],
            ]}
          />
        </View>
        <View className="flex-1 justify-end">
          <View style={{ marginBottom: scaleY(20) }} className="mb-1 gap-1.5">
            <View className="flex-row justify-between">
              <PaywallFooter />
              <UiText className="text-sm font-light text-white">
                {t('paywall.pw1.cancel-anytime')}
              </UiText>
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
      </SafeAreaView>
    </View>
  );
}

type SubSelectorProps = {
  products: IAPSubscription[];
  selected: IAPSubscription | null;
  onSelect: (sub: IAPSubscription) => void;
};

function SubSelector({ products, selected, onSelect }: SubSelectorProps) {
  const { t } = useTranslation();
  const { computeSubscriptionDiscount } = usePurchases();
  const { formatPrice } = useLocale();
  if (!products.length) return null;

  return (
    <View className="mb-2.5 mt-10.5 w-full gap-[3] overflow-hidden rounded-4xl">
      {products.map((sub) => {
        const base = products[0];
        const discount = Math.round(computeSubscriptionDiscount(sub, base));
        const basePricePerDay = base.price / daysInProduct(base);
        const originalPrice = basePricePerDay * daysInProduct(sub);
        const isSelected = selected?.id === sub.id;

        return (
          <TouchableOpacity
            key={sub.id}
            className={twMerge(
              'h-16 flex-row items-center gap-4 bg-white px-5'
            )}
            onPress={() => onSelect(sub)}
            activeOpacity={0.8}
          >
            <Checkbox checked={isSelected} onChange={() => onSelect(sub)} />
            <View className="gap-1">
              <UiText className="text-lg font-semibold">{sub.title}</UiText>
              {discount > 0 ? (
                <UiText>
                  <UiText className="text-sm font-semibold text-[#2A9FFF]">
                    {formatPrice(sub.price, sub.currency)}{' '}
                  </UiText>
                  <UiText className="text-xs font-light text-gray line-through opacity-70">
                    {formatPrice(originalPrice, sub.currency)}
                  </UiText>
                </UiText>
              ) : (
                <UiText className="font-medium text-gray opacity-70">
                  {formatPrice(sub.price, sub.currency)}
                </UiText>
              )}
            </View>

            {discount > 0 && (
              <View
                style={shadows.md}
                className="absolute right-0 top-0 rounded-b-xl bg-[#438FF9] px-6 py-1"
              >
                <UiText className="text-sm font-medium text-white">
                  {t('paywall.pw1.discount-percentage', {
                    percentage: discount,
                  })}
                </UiText>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function FeatureList({ items }: { items: [string, string][] }) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: scaleY(10) }}>
      {items.map(([title, desc], index) => (
        <MotiView
          key={title}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            delay: 200 + index * 100,
            duration: 400,
            easing: Easing.out(Easing.cubic),
          }}
          style={{ flexDirection: 'row', alignItems: 'flex-start' }}
        >
          <DoneIcon color="#FFFFFF" />
          <UiText className="flex-1 pl-3 text-sm color-white">
            <UiText className="text-sm font-semibold color-white">
              {title}
            </UiText>
            {t('paywall.pw1.feature-separator')}
            {desc}
          </UiText>
        </MotiView>
      ))}
    </View>
  );
}
