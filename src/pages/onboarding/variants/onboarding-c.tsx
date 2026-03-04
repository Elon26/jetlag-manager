import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import bg_gallery from '@/images/onboarding/0-1.png';
import cleaner from '@/images/onboarding/2-0.png';
import bg_cleaner from '@/images/onboarding/2-1.png';
import bg_safe from '@/images/onboarding/2-2.png';
import locker from '@/images/onboarding/2-3.png';
import gallery from '@/images/onboarding/2-4.png';

import {
  OnboardingLayoutAnimation,
  type OnboardingSlide,
} from '../onboarding-layout-animation';

export default function OnboardingС() {
  const { t } = useTranslation();

  const slides: OnboardingSlide[] = [
    [
      Slide0,
      t('onboarding.c.slide0.title'),
      t('onboarding.c.slide0.description'),
    ],
    [
      Slide1,
      t('onboarding.c.slide1.title'),
      t('onboarding.c.slide1.description'),
    ],
    [
      Slide2,
      t('onboarding.c.slide2.title'),
      t('onboarding.c.slide2.description'),
    ],
  ];

  return <OnboardingLayoutAnimation slides={slides} />;
}

function Slide0({ slide }: { slide: number }) {
  const isVisible = slide === 0;
  return (
    <View className="w-full flex-1">
      {isVisible && (
        <View className=" flex-1 items-center">
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
            style={{ position: 'absolute' }}
          >
            <Image
              contentFit="cover"
              contentPosition="center"
              source={bg_cleaner}
              style={{ width: scaleX(375), height: scaleX(820) }}
            />
          </MotiView>
          <MotiView
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            from={{ opacity: 0, translateY: 500, scale: 0.5 }}
            style={{ position: 'absolute', top: scaleY(360) }}
            transition={{
              delay: 100,
              opacity: { type: 'timing', duration: 40 },
              translateY: {
                type: 'spring',
                damping: 15,
                stiffness: 180,
                mass: 0.7,
              },
              scale: {
                type: 'spring',
                damping: 32,
                stiffness: 1800,
                mass: 0.9,
              },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={cleaner}
              style={{ width: scaleY(280), height: scaleX(450) }}
            />
          </MotiView>
        </View>
      )}
    </View>
  );
}

function Slide1({ slide }: { slide: number }) {
  const isVisible = slide === 1;
  return (
    <View className="w-full flex-1 items-center overflow-hidden">
      {isVisible && (
        <>
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
              delay: 50,
            }}
            style={{ position: 'absolute' }}
          >
            <Image
              contentFit="cover"
              contentPosition="center"
              source={bg_safe}
              style={{ width: scaleX(375), height: scaleX(815) }}
            />
          </MotiView>
          <MotiView
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
            }}
            from={{
              opacity: 0,
              scale: 0.5,
            }}
            style={{ position: 'absolute', top: scaleY(248) }}
            transition={{
              opacity: { type: 'timing', duration: 50, delay: 50 },
              scale: { type: 'spring', damping: 40, stiffness: 300 },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={locker}
              style={{ width: scaleY(321), height: scaleY(387) }}
            />
          </MotiView>
        </>
      )}
    </View>
  );
}

function Slide2({ slide }: { slide: number }) {
  const isVisible = slide === 2;
  return (
    <View className="w-full flex-1">
      {isVisible && (
        <View className=" flex-1 items-center">
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
            style={{ position: 'absolute' }}
          >
            <Image
              contentFit="cover"
              contentPosition="center"
              source={bg_gallery}
              style={{ width: scaleX(375), height: scaleX(720) }}
            />
          </MotiView>
          <MotiView
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            from={{ opacity: 0, translateY: 500, scale: 0.5 }}
            style={{ position: 'absolute', top: scaleY(290) }}
            transition={{
              delay: 100,
              opacity: { type: 'timing', duration: 40 },
              translateY: {
                type: 'spring',
                damping: 15,
                stiffness: 180,
                mass: 0.7,
              },
              scale: {
                type: 'spring',
                damping: 32,
                stiffness: 1800,
                mass: 0.9,
              },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={gallery}
              style={{ width: scaleY(290), height: scaleY(450) }}
            />
          </MotiView>
        </View>
      )}
    </View>
  );
}
