import { colors } from '@/config/theme';
import AppIcon from '@/images/icon.png';
import CheckIcon from '@/svg/check-blue.svg';
import SettingsIcon from '@/svg/ios-settings.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Env } from '@kirz/expo-env';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 6,
} as const;

export function EnableAutofillSheetContent({
  dismiss,
}: {
  dismiss: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: scaleY(16),
        paddingBottom: insets.bottom + scaleY(16),
        gap: scaleY(20),
      }}
    >
      <View className="flex-row items-center gap-5">
        <SettingsIcon className="size-12" style={shadow} />
        <View className="gap-1">
          <UiText className="text-sm font-medium text-primary">
            {t('secret-folder.autofill.step', { number: 1 })}
          </UiText>
          <UiText className="text-lg opacity-80">
            {t('secret-folder.autofill.go-to-settings')}
          </UiText>
        </View>
      </View>

      <View className="gap-1 pl-4">
        <UiText className="text-sm font-medium text-primary">
          {t('secret-folder.autofill.step', { number: 2 })}
        </UiText>
        <UiText className="text-lg opacity-80">
          {t('secret-folder.autofill.tap-passwords-accounts')}
        </UiText>
      </View>

      <View
        className="flex-row items-center gap-4 rounded-2.5xl bg-[#F6F6F6] px-4"
        style={{ height: scaleX(44) }}
      >
        <View className="size-7.5 items-center justify-center rounded-lg bg-[#8E8E90]">
          <SfSymbol
            name="key.fill"
            size={scaleX(18)}
            tintColor={colors.white.toString()}
          />
        </View>
        <UiText className="text-lg">
          {t('secret-folder.autofill.passwords')}
        </UiText>
      </View>

      <View className="gap-1 pl-4">
        <UiText className="text-sm font-medium text-primary">
          {t('secret-folder.autofill.step', { number: 3 })}
        </UiText>
        <UiText className="text-lg opacity-80">
          {t('secret-folder.autofill.tap-password-options')}
        </UiText>
      </View>

      <View
        className="flex-row items-center gap-4 rounded-2.5xl bg-[#F6F6F6] px-4"
        style={{ height: scaleX(44) }}
      >
        <UiText className="text-lg">
          {t('secret-folder.autofill.password-options')}
        </UiText>
      </View>

      <View className="gap-1 pl-4">
        <UiText className="text-sm font-medium text-primary">
          {t('secret-folder.autofill.step', { number: 4 })}
        </UiText>
        <UiText className="text-lg opacity-80">
          {t('secret-folder.autofill.enable-autofill')}
        </UiText>
      </View>

      <View
        className="flex-row items-center gap-4 rounded-2.5xl bg-[#F6F6F6] px-4"
        style={{ height: scaleX(44) }}
      >
        <UiText className="text-lg">
          {t('secret-folder.autofill.autofill-passwords')}
        </UiText>
        <View className="flex-1" />
        <Switch pointerEvents="none" value />
      </View>

      <View className="gap-1 pl-4">
        <UiText className="text-sm font-medium text-primary">
          {t('secret-folder.autofill.step', { number: 5 })}
        </UiText>
        <UiText className="text-lg opacity-80">
          {t('secret-folder.autofill.select-app', { appName: Env.APP_NAME })}
        </UiText>
      </View>

      <View
        className="flex-row items-center gap-4 rounded-2.5xl bg-[#F6F6F6] px-4"
        style={{ height: scaleX(44) }}
      >
        <Image className="size-7 rounded-lg" source={AppIcon} />
        <UiText className="text-lg">{Env.APP_NAME}</UiText>
        <View className="flex-1" />
        <CheckIcon />
      </View>
      <ButtonPrimary
        className="h-14 w-full"
        label={t('secret-folder.modal.сontinue')}
        onPress={dismiss}
      />
    </BottomSheetScrollView>
  );
}
