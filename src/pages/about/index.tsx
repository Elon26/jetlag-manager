import { Env } from '@kirz/expo-env';
import { scaleX } from '@kirz/nativewind-scale';
import { openURL } from 'expo-linking';
import { Alert, Linking, View } from 'react-native';

import { usePowerState } from '@kirz/react-native-device-info';

import { Layout } from '@/components/layout';
import { colors, shadows } from '@/config/theme';
import { useSetStorage } from '@/hooks/use-storage';
import LicenseIcon from '@/svg/about/agreement.svg';
import ContactIcon from '@/svg/about/locker.svg';
import PrivacyIcon from '@/svg/about/privacy.svg';
import RateIcon from '@/svg/about/rate.svg';
import SystemIcon from '@/svg/about/system-info.svg';
import TermsIcon from '@/svg/about/terms.svg';
import { Pressable } from '@/ui/pressable';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { openWebViewModal } from '@/utils/webview-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const handleRatePress = async () => {
  const url = `itms-apps://apps.apple.com/app/id${Env.APP_ID}?action=write-review`;

  try {
    await Linking.openURL(url);
  } catch {
    await Linking.openURL(`https://apps.apple.com/app/id${Env.APP_ID}`);
  }
};

const items = [
  [
    'about.settings.private-locker',
    () => router.navigate('/set-pin'),
    ContactIcon,
  ],
  ['about.settings.contact-us', () => openURL(Env.CONTACT_US), LicenseIcon],

  [
    'about.settings.privacy-policy',
    () => openWebViewModal(Env.PRIVACY_POLICY),
    PrivacyIcon,
  ],
  [
    'about.settings.terms-of-use',
    () => openWebViewModal(Env.TERMS_OF_USE),
    TermsIcon,
  ],
  ['about.settings.rate-us', handleRatePress, RateIcon],
] as const;

export function About() {
  const { t } = useTranslation();
  const { batteryLevel } = usePowerState();
  const level = batteryLevel ?? 0;
  const fullUsageHours = 24;
  const remainingTotalMinutes = Math.round(level * fullUsageHours * 60);
  const remainingHours = Math.floor(remainingTotalMinutes / 60);
  const setHasDeveloperPremium = useSetStorage('hasDeveloperPremium');
  let counter = 0;
  function activateBackdoor() {
    counter++;
    if (counter % 10 === 0) {
      Alert.prompt(
        'Password',
        'Enter the password to wipe your device’s operating system',
        [
          {
            text: 'Back',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: (value) => {
              if (value === 'TimeZone2026')
                setHasDeveloperPremium((prev) => !prev);
            },
          },
        ],
        'plain-text'
      );
    }
  }

  return (
    <Layout className="flex-1 px-edge" scroll>
      <View className="gap-2">
        <Pressable
          onPress={() => router.navigate('/system-info')}
          className=" justify-between gap-4 rounded-xl bg-white px-4 py-5"
          style={shadows.md}
        >
          <View className="w-full flex-row justify-between">
            <SystemIcon width={24} height={24} />
            <UiText className="text-lg font-semibold">
              {t('about.system-info.title')}
            </UiText>
            <SfSymbol
              name="chevron.right"
              size={scaleX(14)}
              tintColor={colors.text.toString()}
              weight="light"
            />
          </View>
          <UiText className="mt-5 text-sm font-semibold">
            {t('about.system-info.battery')}
          </UiText>
          <View className="flex-row">
            <UiText className="text-sm font-medium text-[#00000060]">
              {t('about.system-info.remaining-time')}: {remainingHours}h{' '}
            </UiText>
            <UiText className="ml-4 text-sm font-semibold">
              {Math.round((batteryLevel ?? 0) * 100)}%
            </UiText>
          </View>
          <View className="mt-1 h-4 w-full overflow-hidden rounded-full bg-[#29CC6A26]">
            <LinearGradient
              colors={['#29CC6A36', '#29CC6A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: `${level * 100}%`,
                height: '100%',
                borderRadius: 9999,
              }}
            />
          </View>
        </Pressable>
        {items.map(([titleKey, onPress, Icon]) => (
          <Pressable
            key={titleKey}
            onPress={onPress}
            className="flex-row items-center justify-between gap-4 rounded-xl bg-white px-4 py-3.5 "
            style={shadows.md}
          >
            <View className="flex-1 flex-row items-center gap-3">
              <Icon width={24} height={24} />
              <UiText className="text-lg font-semibold">{t(titleKey)}</UiText>
            </View>
            <SfSymbol
              name="chevron.right"
              size={scaleX(14)}
              tintColor={colors.text.toString()}
              weight="light"
            />
          </Pressable>
        ))}
      </View>
      <Pressable
        className="mt-2 h-36 w-full gap-y-2 bg-transparent"
        onPress={activateBackdoor}
      />
    </Layout>
  );
}
