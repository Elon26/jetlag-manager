import { FALLBACK_PAYWALL_ID } from '@/hooks/use-paywall/types';
export type ReviewTrigger = 'a' | 'b' | 'off'; 
export const config = {
  isDev: __DEV__,
  onboarding_paywall_id: FALLBACK_PAYWALL_ID,
  in_app_paywall_id: FALLBACK_PAYWALL_ID,
  onboarding_id: 'a',
  indexLayout: 'a',
  review_trigger: 'a' as ReviewTrigger,
} as const;
