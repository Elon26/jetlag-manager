import { usePurchases } from '@kirz/expo-toolkit';
import { scaleX } from '@kirz/nativewind-scale';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';

import { colors } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

export function PaywallHeader() {
  const { t } = useTranslation();
  const { closeModal } = useModals();
  const { restorePurchases } = usePurchases();
  const [isRestoring, setIsRestoring] = useState(false);
  const setIsFirstShowPaywall = useSetStorage('isFirstShowPaywall');
  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert(
          t('paywall.header.restore.success.title'),
          t('paywall.header.restore.success.message')
        );
      } else {
        Alert.alert(
          t('paywall.header.restore.no-purchases.title'),
          t('paywall.header.restore.no-purchases.message')
        );
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert(
        t('paywall.header.restore.error.title'),
        t('paywall.header.restore.error.message')
      );
    } finally {
      setIsRestoring(false);
      setIsFirstShowPaywall(true);
    }
  };

  return (
    <View className="w-full flex-row items-center justify-between pt-5">
      <TouchableOpacity hitSlop={10} onPress={handleRestorePurchases}>
        <View className="flex-row items-center">
          {isRestoring ? (
            <ActivityIndicator color={colors.white.toString()} size="small" />
          ) : (
            <UiText className="text-sm font-light text-white underline">
              {t('paywall.header.restore.button')}
            </UiText>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={10}
        onPress={() => {
          closeModal('Paywall');
          setIsFirstShowPaywall(true);
        }}
        style={{ opacity: 0.5 }}
      >
        <SfSymbol
          name="xmark"
          size={scaleX(24)}
          tintColor={colors.white.toString()}
          weight="light"
        />
      </TouchableOpacity>
    </View>
  );
}
