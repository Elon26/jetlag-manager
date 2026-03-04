import {
  type IAPSubscription,
  useLocale,
  usePurchases,
} from '@kirz/expo-toolkit';
import { scaleY } from '@kirz/nativewind-scale';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import CalendarIcon from '@/svg/paywall/calendar.svg';
import ContactsIcon from '@/svg/paywall/contacts.svg';
import GalleryIcon from '@/svg/paywall/gallery.svg';
import NoteIcon from '@/svg/paywall/note.svg';
import TimeZoneIcon from '@/svg/paywall/time-zone.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { Checkbox } from '@/ui/checkbox';
import { UiText } from '@/ui/ui-text';
import { daysInProduct } from '@/utils/paywall';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaywallFooter } from './paywall-footer';
import { PaywallHeader } from './paywall-header';

export function PaywallPW2() {
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
      const trial = formatPeriod(
        selectedSubscription.trial.periodUnit,
        selectedSubscription.trial.numberOfPeriods
      );
      return t('paywall.pw2.subscribe-with-trial', { trial, price, period });
    }
    return t('paywall.pw2.subscribe-without-trial', { price, period });
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
      <View className="w-full flex-1">
        <View
          style={{ paddingTop: insets.top - scaleY(14) }}
          className="-mt-[1] rounded-b-3xl border border-[#EEEEEE] bg-primary px-4"
        >
          <PaywallHeader />
          <UiText
            style={{ marginTop: scaleY(16), marginBottom: scaleY(20) }}
            className="text-center text-1.5xl font-semibold color-white"
          >
            {t('paywall.pw2.title')}
          </UiText>
        </View>
        <View
          style={{ marginTop: scaleY(12), padding: scaleY(16) }}
          className="rounded-3xl border border-[#EEEEEE70] bg-[#FFFFFF10]"
        >
          <FeatureList
            items={[
              [
                TimeZoneIcon,
                t('paywall.pw2.features.time-zone.title'),
                t('paywall.pw2.features.time-zone.description'),
              ],
              [
                NoteIcon,
                t('paywall.pw2.features.note.title'),
                t('paywall.pw2.features.note.description'),
              ],
              [
                CalendarIcon,
                t('paywall.pw2.features.calendar.title'),
                t('paywall.pw2.features.calendar.description'),
              ],
              [
                GalleryIcon,
                t('paywall.pw2.features.gallery-boost.title'),
                t('paywall.pw2.features.gallery-boost.description'),
              ],
              [
                ContactsIcon,
                t('paywall.pw2.features.contacts-management.title'),
                t('paywall.pw2.features.contacts-management.description'),
              ],
            ]}
          />
        </View>
        <View
          style={{ marginTop: scaleY(20), paddingVertical: scaleY(24) }}
          className="rounded-3xl border border-[#EEEEEE70] bg-[#FFFFFF10] px-4 "
        >
          <SubSelector
            products={sortedSubscriptions}
            selected={selectedSubscription}
            onSelect={setSelectedSubscription}
          />
        </View>
        <View className="flex-1 justify-end">
          <View
            style={{ paddingBottom: scaleY(20) }}
            className="items-center gap-0.5 rounded-t-3xl border-l border-r border-t border-[#EEEEEE] bg-[#3870FF] px-4 "
          >
            <View className="items-center">
              <View
                style={{
                  paddingBottom: insets.bottom,
                  paddingTop: insets.bottom + scaleY(4),
                }}
              >
                <PaywallFooter />
              </View>
              <UiText className="text-sm font-light text-white">
                {t('paywall.pw2.cancel-anytime')}
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
      </View>
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
    <View className="w-full gap-2 overflow-hidden">
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
              'h-16 flex-row items-center justify-between gap-4 overflow-hidden rounded-2.5xl bg-white px-5'
            )}
            onPress={() => onSelect(sub)}
            activeOpacity={0.8}
          >
            <View className="gap-1">
              <UiText className="text-lg font-semibold">{sub.title}</UiText>
              {discount > 0 ? (
                <UiText>
                  <UiText className="text-sm font-medium text-[#2A9FFF]">
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
            <Checkbox checked={isSelected} onChange={() => onSelect(sub)} />
            {discount > 0 && (
              <View
                style={shadows.md}
                className="absolute right-0 top-0 rounded-bl-xl bg-[#438FF9] px-4 py-[1]"
              >
                <UiText className="text-sm font-medium text-white">
                  {t('paywall.pw2.discount-percentage', {
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

type FeatureListProps = {
  items: [React.FC<{ color?: string }>, string, string][];
};

export function FeatureList({ items }: FeatureListProps) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: scaleY(10) }}>
      {items.map(([Icon, title, desc], index) => (
        <MotiView
          key={title}
          from={{ opacity: 0, translateY: 25, scale: 0.95 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{
            delay: 200 + index * 120,
            translateY: {
              type: 'timing',
              duration: 450,
              easing: Easing.out(Easing.cubic),
            },
            opacity: {
              type: 'timing',
              duration: 400,
            },
            scale: {
              type: 'spring',
              damping: 15,
              stiffness: 180,
              mass: 0.6,
            },
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Icon color="#FFFFFF" />
          <UiText className="flex-1 pl-2 text-sm color-white">
            <UiText className="text-sm font-semibold color-white">
              {title}
            </UiText>
            {t('paywall.pw2.feature-separator')}
            {desc}
          </UiText>
        </MotiView>
      ))}
    </View>
  );
}
