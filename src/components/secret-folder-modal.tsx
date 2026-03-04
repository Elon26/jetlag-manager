import { useModals } from '@/hooks/use-modals';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@/svg/secret-folder/close.svg';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { MotiView, View } from 'moti';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SecretFolderModal() {
  const { t } = useTranslation();
  const { closeModal } = useModals();

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const handleAddProtection = () => {
    closeModal('SecretFolderModal');
    setTimeout(() => {
      router.navigate('/set-pin');
    }, 250);
  };

  return (
    <View
      className="items-center justify-center"
      style={{
        width,
        height,
        paddingBottom: insets.bottom + scaleY(10),
      }}
    >
      <MotiView
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        className="z-20 w-[91%]"
        from={{ opacity: 0, translateY: scaleY(120), scale: 1.05 }}
        transition={{
          opacity: {
            type: 'timing',
            duration: 1000,
            easing: Easing.out(Easing.cubic),
          },
          translateY: {
            type: 'timing',
            duration: 1000,
            easing: Easing.out(Easing.cubic),
          },
          scale: {
            type: 'timing',
            duration: 1000,
            easing: Easing.out(Easing.cubic),
          },
        }}
      >
        <View className="w-full justify-center rounded-3xl bg-white px-6 py-14">
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => closeModal('SecretFolderModal')}
          >
            <CloseIcon />
          </TouchableOpacity>
          <View className="items-center pb-9">
            <UiText className="mb-5 text-center text-2xl font-semibold text-text">
              {t('secret-folder.modal.title')}
            </UiText>

            <UiText className=" pt-5 text-center text-sm text-gray opacity-80">
              {t('secret-folder.modal.description')}
            </UiText>
          </View>
          <ButtonPrimary
            className="h-13 rounded-2xl"
            label={t('secret-folder.modal.action-add')}
            onPress={handleAddProtection}
          />
          <ButtonPrimary
            className=" mt-2 h-13 rounded-2xl bg-[#EFEFEF] "
            onPress={() => closeModal('SecretFolderModal')}
          >
            <UiText className=" text-xl font-semibold text-text opacity-80">
              {t('secret-folder.modal.action-later')}
            </UiText>
          </ButtonPrimary>
        </View>
      </MotiView>
    </View>
  );
}
