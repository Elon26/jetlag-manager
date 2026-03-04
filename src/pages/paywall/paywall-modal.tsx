import { useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';
import { FALLBACK_PAYWALL_ID, paywallls } from '@/hooks/use-paywall/types';

export function PaywallModal({
  modal: { params },
}: ModalComponentProp<
  ModalStackParams,
  ModalStackParams['Paywall'],
  'Paywall'
>) {
  const { width, height } = useWindowDimensions();
  const PaywallComponent =
    paywallls[params?.id || FALLBACK_PAYWALL_ID] ||
    paywallls[FALLBACK_PAYWALL_ID];

  return (
    <View style={{ width, height }}>
      <PaywallComponent />
    </View>
  );
}
