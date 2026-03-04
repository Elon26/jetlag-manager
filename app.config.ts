import type { ConfigContext, ExpoConfig } from '@expo/config';
import { Env } from '@kirz/expo-env';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: Env.APP_NAME,
    description: `${Env.APP_NAME} Mobile App`,
    platforms: ['ios'],
    slug: Env.APP_BUNDLE_ID.toLowerCase().replaceAll('.', '-'),
    version: Env.APP_VERSION.toString(),
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'light',
    backgroundColor: '#FBFBFB',
    scheme: Env.APP_BUNDLE_ID.toLowerCase().replaceAll('.', '-'),
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: Env.APP_BUNDLE_ID,
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSMotionUsageDescription:
          'This app requires access to motion sensors to display raw sensor data directly to the user.',
        NSPhotoLibraryUsageDescription:
          'Access is needed to search for similar photos, to import photos you want to hide, and to add photos to a widget. Your photos won’t be stored on any of our servers.',
        NSContactsUsageDescription:
          'Contacts information is used to find duplicates. We will not upload any of your private data to our servers.',
        PHPhotoLibraryPreventAutomaticLimitedAccessAlert: true,
        NSCameraUsageDescription:
          'Please, provide access to your camera so application can take photos and use them. We will not upload any of your private data to our servers.',
      },
      entitlements: {
        // 'com.apple.security.application-groups': [
        //   'group.at.zm-cleaner-vpn.widget',
        // ],
        'com.apple.developer.authentication-services.autofill-credential-provider': true,
      },
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#FBFBFB',
      },
      package: Env.APP_BUNDLE_ID.replaceAll('-', '_'),
    },
    plugins: [
      'expo-font',
      'expo-video',
      'expo-router',
      'expo-sqlite',
      'expo-localization',
      'expo-secure-store',
      'expo-web-browser',
      '@react-native-firebase/app',
      [
        'react-native-permissions',
        {
          // Add setup_permissions to your Podfile (see iOS setup - steps 1, 2 and 3)
          iosPermissions: ['Camera', 'PhotoLibrary', 'Contacts'],
        },
      ],
      [
        './credential-provider.plugin',
        {
          devTeam: 'L427NWAC76',
          targetNameMainProject: 'docsapp',
        },
      ],
      // [
      //   './widgets.plugin',
      //   {
      //     devTeam: 'L427NWAC76',
      //   },
      // ],
      [
        'expo-local-authentication',
        {
          faceIDPermission:
            'Allow $(PRODUCT_NAME) to use Face ID to protect your secret pictures and contacts.',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            deploymentTarget: '15.1',
          },
          android: {
            kotlinVersion: '1.7.22', // for softinput package
          },
        },
      ],
      [
        'app-icon-badge',
        {
          enabled: Env.NODE_ENV !== 'production',
          badges: [
            {
              text: Env.NODE_ENV,
              type: 'banner',
              color: 'white',
            },
          ],
        },
      ],
      [
        'expo-user-identity',
        {
          iCloudContainerEnvironment:
            Env.NODE_ENV === 'development' ? 'Development' : 'Production',
        },
      ],
      [
        'expo-tracking-transparency',
        {
          userTrackingPermission:
            'This identifier will be used to deliver personalized ads to you.',
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#FBFBFB',
          image: './assets/images/splash.png',
          imageWidth: 125,
          dark: {
            backgroundColor: '#FBFBFB',
            image: './assets/images/splash.png',
          },
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location so you can find your way around.',
          locationAlwaysPermission:
            'Allow $(PRODUCT_NAME) to use your location so you can find your way around.',
          locationWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location so you can find your way around.',
        },
      ],
      // [
      //   'react-native-fbsdk-next',
      //   {
      //     appID: Env.FACEBOOK_APP_ID,
      //     displayName: Env.FACEBOOK_DISPLAY_NAME,
      //     clientToken: Env.FACEBOOK_CLIENT_TOKEN,
      //     scheme: Env.FACEBOOK_SCHEME,
      //     advertiserIDCollectionEnabled:
      //       Env.FACEBOOK_ADVERTISER_ID_COLLECTION_ENABLED,
      //     autoLogAppEventsEnabled: Env.FACEBOOK_AUTO_LOG_APP_EVENTS_ENABLED,
      //   },
      // ],
      ['expo-asset', { assets: ['assets/bundle'] }],
      [
        'react-native-appsflyer',
        { shouldUseStrictMode: Env.APPSFLYER_USE_STRICT_MODE },
      ],
    ],
  };
};
