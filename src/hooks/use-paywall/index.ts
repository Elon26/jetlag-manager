import { useAnalytics } from '@kirz/expo-toolkit';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { useConfig } from '@/hooks/use-config';
import { useSetStorage } from '@/hooks/use-storage';

import { useHasPremiumWithBackdoor } from '../use-developer-purchases';
import { useModals } from '../use-modals';
import type { PaywallPlacement } from './types';

export function usePaywall() {
  const { openModal, closeModal } = useModals();
  const hasPremium = useHasPremiumWithBackdoor();
  const { in_app_paywall_id, onboarding_paywall_id } = useConfig();
  const { logEvent } = useAnalytics();
  const setIntroductoryPaywallShown = useSetStorage('introductoryPaywallShown');

  const showPaywall = useCallback(
    (type: PaywallPlacement = 'in_app') => {
      const paywallId =
        type === 'onboarding' ? onboarding_paywall_id : in_app_paywall_id;
      openModal('Paywall', { id: paywallId });
    },
    [in_app_paywall_id, openModal, onboarding_paywall_id]
  );

  useEffect(() => {
    logEvent(`af_show_paywall_v${in_app_paywall_id}`);
  }, [in_app_paywall_id, logEvent]);

  const hidePaywall = useCallback(() => {
    setIntroductoryPaywallShown(true);
    closeModal('Paywall');
  }, [closeModal, setIntroductoryPaywallShown]);

  const premiumAction = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny:
    <T extends any[]>(fn: (...args: T) => any) => {
      return async (...args: T) => {
        if (__DEV__) {
          let resolve: (c: boolean) => void;
          const promise = new Promise<boolean>((res) => {
            resolve = res;
          });

          Alert.alert(
            'Premium Action Called',
            'This message is shown ONLY in development mode to indicate that a premium action was called.',
            [
              {
                text: 'Show Paywall',
                onPress: () => {
                  showPaywall('in_app');
                  resolve(false);
                },
              },
              {
                text: 'Continue with the action',
                onPress: () => {
                  resolve(false);
                  return fn(...args);
                },
              },
              {
                text: 'Continue with the default flow',
                onPress: () => {
                  resolve(true);
                },
                style: 'cancel',
              },
            ]
          );
          const doContinue = await promise;
          if (!doContinue) {
            return;
          }
        }

        if (hasPremium) {
          return fn(...args);
        }
        showPaywall('in_app');
      };
    },
    [showPaywall, hasPremium]
  );

  return {
    isLoading: hasPremium == null,
    showPaywall,
    hidePaywall,
    premiumAction,
  };
}
