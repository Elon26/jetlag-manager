import { RemoteUiView } from '@pnlight/sdk-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import { usePaywall } from '@/hooks/use-paywall';

export function OnboardingFeaturePage() {
  const { showPaywall } = usePaywall();

  return (
    <View className="flex-1">
      <RemoteUiView
        placement="feature"
        onAction={({ logId }) => {
          if (logId === 'close_button') {
            router.replace('/main');
          }

          if (logId === 'paywall_button') {
            showPaywall('onboarding');
            router.replace('/main');
          }
        }}
      />
    </View>
  );
}
