import '../../global.css';

import {
  type NativeStackHeaderLeftProps,
  type NativeStackHeaderProps,
  type NativeStackHeaderRightProps,
} from '@react-navigation/native-stack';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/config/theme';
import app from '@/root';
import ArrowLeft from '@/svg/back.svg';
import { UiText } from '@/ui/ui-text';

type HeaderProps = {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
};

function AppHeader(props: NativeStackHeaderProps & HeaderProps) {
  const { options, navigation } = props;
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const isMain = pathname === '/main' || pathname === '/';
  const isTimezone = pathname.startsWith('/timezone');
  const showBack = !isMain && !isTimezone;
  const isSecret = pathname.startsWith('/secret-');
  const isContactsOrganiser = pathname.startsWith('/contacts-organiser');
  const isContacts = pathname.startsWith('/contacts');
  const forceWhiteHeaderBg = isSecret || isContactsOrganiser || isContacts;

  const canGoBack = navigation.canGoBack();
  const tintColor =
    (options.headerTintColor as string | undefined) ?? undefined;

  const leftProps: NativeStackHeaderLeftProps = {
    canGoBack,
    tintColor,
  };

  const rightProps: NativeStackHeaderRightProps = {
    tintColor,
  };

  const left = options.headerLeft?.(leftProps);
  const right = options.headerRight?.(rightProps);

  const title =
    (typeof options.title === 'string'
      ? (options.title as string)
      : undefined) ?? props.title;

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={[
        'absolute inset-x-0 top-0 z-10',
        forceWhiteHeaderBg ? 'bg-white' : 'bg-background',
      ].join(' ')}
    >
      <View className="h-14 flex-row items-center px-4">
        <View className="w-14 items-start justify-center">
          {showBack ? (
            <Pressable
              hitSlop={10}
              onPress={() =>
                canGoBack ? navigation.goBack() : router.replace('/main')
              }
            >
              <ArrowLeft className="size-6" />
            </Pressable>
          ) : (
            (left ?? props.left ?? null)
          )}
        </View>

        <View
          className="flex-1 items-center justify-center"
          pointerEvents="none"
        >
          {title ? (
            <UiText className="text-base font-semibold" numberOfLines={1}>
              {title}
            </UiText>
          ) : null}
        </View>

        <View className="w-14 items-end justify-center">
          {right ?? props.right ?? null}
        </View>
      </View>
    </View>
  );
}

// eslint-disable-next-line react/function-component-definition
const Wrapper = function RootLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background.toString() },
        headerShown: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
        headerTitleStyle: { fontSize: 20, fontWeight: '600' },
        headerBackTitle: '',
        headerBackVisible: false,
        headerTintColor: colors.text.toString(),
        header: (props) => <AppHeader {...(props as NativeStackHeaderProps)} />,
      }}
    >
      <Stack.Screen
        name="main"
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="set-pin"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="reset-pin"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="speed-test"
        options={{
          title: t('speed-test.widget.title'),
          header: (props) => (
            <AppHeader {...(props as NativeStackHeaderProps)} />
          ),
        }}
      />
      <Stack.Screen
        name="secret-contacts"
        options={{
          headerTransparent: true,
          title: t('secret-folder.contacts.title'),
        }}
      />
      <Stack.Screen
        name="secret-gallery"
        options={{
          headerTransparent: true,
          title: t('secret-folder.gallery.title'),
        }}
      />
      <Stack.Screen
        name="secret-passwords"
        options={{
          headerTransparent: true,
          title: t('secret-folder.passwords.title'),
        }}
      />
      <Stack.Screen
        name="secret-folder"
        options={{
          headerTransparent: true,
          title: t('secret-folder.widget.title'),
        }}
      />
      <Stack.Screen
        name="contacts-organiser"
        options={{
          headerTransparent: true,
          title: t('cleaner.contacts-organiser.widget.title'),
        }}
      />
      <Stack.Screen
        name="gallery-album"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerTransparent: true,
          title: t('about.settings.title') || 'About',
        }}
      />
      <Stack.Screen
        name="system-info"
        options={{
          headerTransparent: true,
          title: t('about.system-info.title'),
        }}
      />
      <Stack.Screen
        name="gallery-organiser"
        options={{
          headerTransparent: true,
          title: t('cleaner.gallery-organiser.widget.title'),
        }}
      />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="onboarding-feature"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="timezone/index"
        options={{
          title: t('timezone.time-management'),
        }}
      />
      <Stack.Screen
        name="timezone/calendar"
        options={{
          title: t('timezone.time-management'),
        }}
      />
      <Stack.Screen
        name="timezone/note"
        options={{
          title: t('timezone.note'),
        }}
      />
      <Stack.Screen
        name="timezone/time"
        options={{
          title: t('timezone.time-management'),
        }}
      />
    </Stack>
  );
};

const RootWrapper = app.wrapLayout(Wrapper);
export default function RootLayout() {
  return <RootWrapper />;
}
