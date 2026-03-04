

import { PaywallPW1 } from '@/pages/paywall/paywall-pw1';
import { PaywallPW2 } from '@/pages/paywall/paywall-pw2';
import { PaywallPW3 } from '@/pages/paywall/paywall-pw3';

import type { ComponentType } from 'react';


export type PaywallPlacement = 'onboarding' | 'in_app';
export type PaywallId = 'PW1' | 'PW2' | 'PW3'  ;
export const FALLBACK_PAYWALL_ID: PaywallId = 'PW1';

export const paywallls: Record<PaywallId, ComponentType> = {
  PW1: PaywallPW1,
  PW2: PaywallPW2,
  PW3: PaywallPW3,

};
