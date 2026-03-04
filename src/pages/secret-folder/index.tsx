import { scaleX } from '@kirz/nativewind-scale';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { usePinSettings } from 'expo-with-pincode';
import { MotiView } from 'moti';
import numbro from 'numbro';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import { Layout } from '@/components/layout';
import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useStorage } from '@/hooks/use-storage';
import AttentionIcon from '@/images/secret-folder/attention.png';
import { usePrivateContactIds } from '@/modules/contacts-kit/react';
import ContactsIcons from '@/svg/secret-folder/contacts-icons.svg';
import ContactsIcon from '@/svg/secret-folder/contacts.svg';
import GalleryIcons from '@/svg/secret-folder/gallery-icons.svg';
import GalleryIcon from '@/svg/secret-folder/gallery.svg';
import PasswordsIcon from '@/svg/secret-folder/passwords.svg';
import ShieldIcon from '@/svg/secret-folder/shield.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { useSecretFolderGallery } from './hooks/use-secret-folder-gallery';
import { useSecretPasswords } from './hooks/use-secret-passwords';

export function SecretFolderScreen() {
  const { t } = useTranslation();
  const { isPincodeSet } = usePinSettings();
  const { openModal } = useModals();

  const [secretFolderModalIsShown, setSecretFolderModalIsShown] = useStorage(
    'secretFolderModalIsShown'
  );

  useFocusEffect(() => {
    if (!secretFolderModalIsShown && !isPincodeSet) {
      openModal('SecretFolderModal');
      setSecretFolderModalIsShown(true);
    }
  });

  const { ids: contactIds } = usePrivateContactIds();
  const { assets } = useSecretFolderGallery();
  const { passwords } = useSecretPasswords();

  return (
    <Layout scroll className="flex-1 px-4">
      {!isPincodeSet ? (
        <View
          className="mt-8 gap-2 rounded-2.5xl bg-white px-4 py-3"
          style={shadows.md}
        >
          <View className="flex-1 items-center">
            <MotiView
              from={{
                opacity: 0,
                scale: 1.08,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
              }}
              transition={{
                opacity: { type: 'timing', duration: 500 },
                scale: {
                  type: 'timing',
                  duration: 700,
                  easing: Easing.out(Easing.cubic),
                },
                delay: 80,
              }}
              style={{
                position: 'absolute',
                zIndex: 10,
                right: scaleX(-20),
                top: scaleX(-50),
              }}
            >
              <Image
                contentFit="cover"
                source={AttentionIcon}
                style={{ width: scaleX(160), height: scaleX(110) }}
              />
            </MotiView>
          </View>
          <UiText className="px-17 text-center text-xl font-medium">
            {t('secret-folder.not-protected.title')}
          </UiText>
          <UiText className="text-center text-sm leading-normal text-gray">
            {t('secret-folder.not-protected.description')}
          </UiText>
          <Pressable
            className="mt-2 self-center rounded-2xl bg-primary px-21 py-2.5"
            onPress={() => {
              impactAsync(ImpactFeedbackStyle.Light);
              router.navigate('/set-pin');
            }}
          >
            <UiText className="text-xl font-semibold text-white">
              {t('secret-folder.not-protected.action')}
            </UiText>
          </Pressable>
        </View>
      ) : (
        <Pressable
          className="mt-5 gap-2 rounded-3xl bg-white px-4 py-3"
          style={shadows.md}
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            router.navigate('/set-pin');
          }}
        >
          <View className="absolute -right-0 -top-0 h-7 w-20 rounded-bl-2.5xl rounded-tr-3xl bg-[#69DA47] py-1 pl-13">
            <ShieldIcon />
          </View>
          <UiText className="px-17 text-center text-xl font-medium">
            {t('secret-folder.protected.title')}
          </UiText>

          <UiText className="text-center text-sm leading-normal text-gray">
            {t('secret-folder.protected.description')}
          </UiText>
        </Pressable>
      )}

      <View className="gap-3 pt-4">
        <Pressable
          className="w-full rounded-3xl bg-white p-5"
          style={shadows.md}
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            router.navigate('/secret-gallery');
          }}
        >
          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-2xl bg-white px-4 py-3"
              style={[
                shadows.md,
                {
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 4,
                },
              ]}
            >
              <GalleryIcon />
              <View className="rounded-lg">
                <View className="absolute top-1.5 h-12 w-1 rounded-l-lg bg-[#F2DCF655]" />
                <UiText className="mt-1.5 pl-3 text-xl font-semibold">
                  {t('secret-folder.gallery.title')}
                </UiText>
                <UiText className="mt-2 pl-3 text-sm text-[#9D9D9D]">
                  {numbro(assets?.length ?? 0).format({
                    thousandSeparated: true,
                  })}{' '}
                  {t('secret-folder.gallery.photos')}
                </UiText>
              </View>
            </View>
            <View>
              <GalleryIcons width={scaleX(130)} height={scaleX(116)} />
            </View>
          </View>
        </Pressable>
        <Pressable
          className="w-full rounded-3xl bg-white p-5"
          style={shadows.md}
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            router.navigate('/secret-contacts');
          }}
        >
          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-2xl bg-white px-4 py-3"
              style={[
                shadows.md,
                {
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 4,
                },
              ]}
            >
              <ContactsIcon />
              <View className="rounded-lg">
                <View className="absolute top-1.5 h-12 w-1 rounded-l-lg bg-[#DCEBFE55]" />
                <UiText className="mt-1.5 pl-3 text-xl font-semibold">
                  {t('secret-folder.contacts.title')}
                </UiText>
                <UiText className="mt-2 pl-3 text-sm text-[#9D9D9D]">
                  {numbro(contactIds?.length ?? 0).format({
                    thousandSeparated: true,
                  })}{' '}
                  {t('secret-folder.contacts.contacts')}
                </UiText>
              </View>
            </View>
            <View>
              <ContactsIcons width={scaleX(130)} height={scaleX(116)} />
            </View>
          </View>
        </Pressable>

        <Pressable
          className="rounded-3xl bg-white px-4 py-3"
          style={shadows.md}
          onPress={() => {
            impactAsync(ImpactFeedbackStyle.Light);
            router.navigate('/secret-passwords');
          }}
        >
          <View className="gap-3">
            <View className="flex-row justify-between">
              <UiText className="text-xl font-semibold">
                {t('secret-folder.passwords.title')}
              </UiText>
              <UiText className="text-sm text-[#9D9D9D]">
                {t('secret-folder.passwords.autofill-guide')}
              </UiText>
            </View>
            <View className="rounded-2xl bg-[#F8F8F8] px-4 py-3">
              <View className="flex-row">
                <PasswordsIcon />
                <View>
                  <UiText className="pl-1.5 text-xs text-gray">
                    {t('secret-folder.passwords.add-passwords')}
                  </UiText>
                  <UiText className="pl-1.5 text-xl font-semibold text-[#2C2C2C]">
                    {numbro(passwords?.length ?? 0).format({
                      thousandSeparated: true,
                    })}{' '}
                    <UiText>{t('secret-folder.passwords.passwords')}</UiText>
                  </UiText>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </Layout>
  );
}
