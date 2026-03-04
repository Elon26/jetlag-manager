import { router, useFocusEffect } from 'expo-router';
import { useEffect, useState } from 'react';

import { AnimationLoader } from '@/components/animation-loader';
import {
  NotificationProvider,
  registerForPushNotificationsAsync,
} from '@/hooks/use-notifications';
import { useStorageValue } from '@/hooks/use-storage';

export default function Index() {
  const storageValue = useStorageValue('isOnboardingFinished');
  const [isOnboardingFinished, setIsOnboardingFinished] = useState<
    boolean | null
  >(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (storageValue !== undefined) {
      const finished = Boolean(storageValue);
      setIsOnboardingFinished(finished);
      setIsReady(true);
    }
  }, [storageValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      registerForPushNotificationsAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(() => {
    if (isReady && isOnboardingFinished !== null) {
      router.replace(isOnboardingFinished ? '/main' : '/onboarding');
    }
  });

  if (!isReady) {
    return <AnimationLoader />;
  }

  if (isOnboardingFinished) {
    return (
      <NotificationProvider>
        <AnimationLoader />
      </NotificationProvider>
    );
  }

  return <AnimationLoader />;
}
