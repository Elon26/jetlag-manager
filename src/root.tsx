import 'react-native-url-polyfill/auto';
import '../global.css';
import '../i18n';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Env } from '@kirz/expo-env';
import { createApp } from '@kirz/expo-toolkit';
// @ts-expect-error TODO: update type defs
import { ApphudModule } from '@kirz/expo-toolkit/apphud';
import { AppsFlyerModule } from '@kirz/expo-toolkit/appsflyer';
// import { FacebookModule } from '@kirz/expo-toolkit/facebook';
// @ts-expect-error TODO: update type defs
import { FirebaseModule } from '@kirz/expo-toolkit/firebase';
// @ts-expect-error TODO: update type defs
import { IdfaModule } from '@kirz/expo-toolkit/idfa';
// @ts-expect-error TODO: update type defs
import { IdfvModule } from '@kirz/expo-toolkit/idfv';
// @ts-expect-error TODO: update type defs
import { LocalizationModule } from '@kirz/expo-toolkit/localization';
import { PNLightModule } from '@kirz/expo-toolkit/pnlight';
import { SentryModule } from '@kirz/expo-toolkit/sentry';
import { SmartLookModule } from '@kirz/expo-toolkit/smartlook';
import { UserIdentityModule } from '@kirz/expo-toolkit/user-identity';
import { NativewindWrapper } from '@kirz/nativewind-scale';
import MaskedView from '@react-native-masked-view/masked-view';
import { QueryClientProvider } from '@tanstack/react-query';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { setPincodeConfig } from 'expo-with-pincode';
import i18next from 'i18next';
import { cssInterop } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ModalProvider } from 'react-native-modalfy';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import { modalsStack } from '@/components/modals';
import { storage } from '@/hooks/use-storage';

import tailwindConfig from '../tailwind.config';
import { queryClient } from './config/legacy/query-client';
import { AuthScreen, SetPinScreen } from './pages/pincode';

setPincodeConfig({
  AuthScreen,
  SetPinScreen,
  requireSetPincode: false,
  onSuccessfulAuth: () => notificationAsync(NotificationFeedbackType.Success),
  onFailedAuth: () => notificationAsync(NotificationFeedbackType.Error),
  messages: {
    create: i18next.t('secret-folder.auth.messages.create'),
    confirm: i18next.t('secret-folder.auth.messages.confirm'),
    set: i18next.t('secret-folder.auth.messages.set'),
    nomatch: i18next.t('secret-folder.auth.messages.nomatch'),
    check: i18next.t('secret-folder.auth.messages.check'),
    correct: i18next.t('secret-folder.auth.messages.correct'),
    incorrect: i18next.t('secret-folder.auth.messages.incorrect'),
    reset: i18next.t('secret-folder.auth.messages.reset'),
    isreset: i18next.t('secret-folder.auth.messages.isreset'),
  },
  animationDuration: 500,
  submitTimeout: 1000,
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default createApp({
  env: Env,
  storage: storage,
  providers: ({ withProps }) => [
    GestureHandlerRootView,
    withProps(KeyboardProvider, {}),
    withProps(NativewindWrapper, { config: tailwindConfig }),
    withProps(QueryClientProvider, { client: queryClient }),
    withProps(ModalProvider, { stack: modalsStack }),
    withProps(BottomSheetModalProvider, {}),
  ],
  modules: [
    new SmartLookModule(),
    new SentryModule(),
    new IdfaModule(),
    new IdfvModule(),
    new LocalizationModule(),
    new UserIdentityModule(),
    new PNLightModule(),
    new AppsFlyerModule(),
    new FirebaseModule(),
    new ApphudModule(),
    // new FacebookModule(),
  ],
});

cssInterop(LinearGradient, {
  className: { target: 'style' },
});
cssInterop(Image, {
  className: { target: 'style' },
});
cssInterop(ImageBackground, {
  className: { target: 'style' },
});
cssInterop(MaskedView, {
  className: { target: 'style' },
});
