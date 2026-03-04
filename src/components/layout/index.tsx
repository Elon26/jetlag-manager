import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

import { useHasPremiumWithBackdoor } from '@/hooks/use-developer-purchases';
import { usePaywall } from '@/hooks/use-paywall';
import ProIcon from '@/svg/pro.svg';
import SettingsIcon from '@/svg/settings.svg';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

export function SettingsButton() {
  return (
    <Pressable hitSlop={10} onPress={() => router.navigate('/about')}>
      <SettingsIcon className="size-6" />
    </Pressable>
  );
}

export function ProButton() {
  const hasPremium = useHasPremiumWithBackdoor();
  const { showPaywall } = usePaywall();
  return (
    <Pressable
      onPress={() => {
        if (!hasPremium) {
          showPaywall('in_app');
        }
      }}
      hitSlop={20}
    >
      <ProIcon />
    </Pressable>
  );
}

type LayoutProps = PropsWithChildren & {
  className?: string;
  safeArea?: boolean;
  scroll?: boolean;
  header?: boolean;
};

export function Layout({
  children,
  className = '',
  safeArea = true,
  scroll = false,
  header = false,
}: LayoutProps) {
  const baseClasses =
    `flex-1 bg-background ${safeArea ? 'pb-safe pt-safe-offset-14 pt-4' : ''} ${className}`.trim();

  if (scroll) {
    return (
      <View className={baseClasses} style={{ overflow: 'visible' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            overflow: 'visible',
            paddingTop: 0,
          }}
          style={{
            overflow: 'visible',
            marginTop: 0,
          }}
        >
          {header && (
            <View
              style={{
                zIndex: 100,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: scaleY(20),
              }}
            >
              <SettingsButton />
              <UiText style={{ fontSize: 16, fontWeight: '600' }}>
                {Env.APP_NAME}
              </UiText>
              <ProButton />
            </View>
          )}
          {children}
        </ScrollView>
      </View>
    );
  }

  if (header && !scroll) {
    return (
      <View className={baseClasses} style={{ overflow: 'visible' }}>
        <View
          style={{
            zIndex: 10,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            paddingHorizontal: 16,
          }}
        >
          <SettingsButton />
          <UiText style={{ fontSize: 16, fontWeight: '600' }}>
            {Env.APP_NAME}
          </UiText>
          <ProButton />
        </View>
        {children}
      </View>
    );
  }

  return (
    <View className={baseClasses} style={{ overflow: 'visible' }}>
      {children}
    </View>
  );
}
