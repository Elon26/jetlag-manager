import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

import { useHasPremiumWithBackdoor } from './use-developer-purchases';
import { usePaywall } from './use-paywall';

const TOTAL_LIMIT = 3;
const STORAGE_KEY = 'cleaner-limit';

const limitKeys = ['secret-files', 'secret-contacts'];
type LimitKey = (typeof limitKeys)[number];

const getLimit = (key: LimitKey) => {
  if (__DEV__) {
    return TOTAL_LIMIT;
  }
  const secretStorageItemKey = `${STORAGE_KEY}-${key}`;
  const storedLimit = SecureStore.getItem(secretStorageItemKey);
  if (storedLimit === null) {
    SecureStore.setItem(secretStorageItemKey, TOTAL_LIMIT.toString());
    return TOTAL_LIMIT;
  }
  return parseInt(storedLimit, 10) ?? TOTAL_LIMIT;
};

export function useCleanerLimit(key: LimitKey) {
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  const [limit, setLimit] = useState<number>(getLimit(key));

  const isLimitLeft = () => {
    if (hasPremium) {
      return true;
    }
    return getLimit(key) > 0;
  };

  const decrementLimit = (by = 1) => {
    if (hasPremium) {
      return by;
    }
    const storedLimit = getLimit(key);
    const delta = Math.min(storedLimit, by);
    const newLimit = Math.max(0, storedLimit - delta);
    const secretStorageItemKey = `${STORAGE_KEY}-${key}`;
    SecureStore.setItem(secretStorageItemKey, newLimit.toString());
    setLimit(newLimit);
    if (by >= storedLimit) {
      showPaywall();
    }
    return delta;
  };

  return {
    limit,
    isLimitLeft,
    decrementLimit,
  };
}
