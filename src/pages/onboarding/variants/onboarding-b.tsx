import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import notes from '@/images/onboarding/1-0.png';
import bg_notes from '@/images/onboarding/1-1.png';
import calendar from '@/images/onboarding/1-2.png';
import bg_tasks from '@/images/onboarding/1-3.png';
import events from '@/images/onboarding/1-4.png';
import bg_gallery from '@/images/onboarding/1-5.png';
import organiser from '@/images/onboarding/1-6.png';

import {
  OnboardingLayoutAnimation,
  type OnboardingSlide,
} from '../onboarding-layout-animation';

export default function OnboardingB() {
  const { t } = useTranslation();

  const slides: OnboardingSlide[] = [
    [
      Slide0,
      t('onboarding.b.slide0.title'),
      t('onboarding.b.slide0.description'),
    ],
    [
      Slide1,
      t('onboarding.b.slide1.title'),
      t('onboarding.b.slide1.description'),
    ],
    [
      Slide2,
      t('onboarding.b.slide2.title'),
      t('onboarding.b.slide2.description'),
    ],
  ];

  return <OnboardingLayoutAnimation slides={slides} />;
}

function Slide0({ slide }: { slide: number }) {
  const isVisible = slide === 0;
  const insets = useSafeAreaInsets();
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
              source={bg_notes}
              style={{
                width: scaleX(375),
                height: scaleY(640) + insets.top * 3,
              }}
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
            style={{
              position: 'absolute',
              top: scaleY(170),
              left: -5,
            }}
            transition={{
              opacity: { type: 'timing', duration: 50, delay: 50 },
              scale: { type: 'spring', damping: 40, stiffness: 300 },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={notes}
              style={{ width: scaleX(250), height: scaleX(250) }}
            />
          </MotiView>
        </View>
      )}
    </View>
  );
}

function Slide1({ slide }: { slide: number }) {
  const isVisible = slide === 1;
  const insets = useSafeAreaInsets();
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
              source={bg_tasks}
              style={{
                width: scaleX(375),
                height: scaleY(640) + insets.top * 3,
              }}
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
            style={{ position: 'absolute', top: scaleX(112) }}
            transition={{
              opacity: { type: 'timing', duration: 50, delay: 50 },
              scale: { type: 'spring', damping: 40, stiffness: 300 },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={calendar}
              style={{ width: scaleY(310), height: scaleY(385) }}
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
            style={{
              position: 'absolute',
              top: scaleY(200) + insets.top * 2,
              left: -5,
            }}
            transition={{
              opacity: { type: 'timing', duration: 50, delay: 50 },
              scale: { type: 'spring', damping: 40, stiffness: 300 },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={events}
              style={{ width: scaleX(250), height: scaleX(250) }}
            />
          </MotiView>
        </>
      )}
    </View>
  );
}

export function Slide2({ slide }: { slide: number }) {
  const isVisible = slide === 2;
  const insets = useSafeAreaInsets();
  return (
    <View className="w-full flex-1 items-center overflow-hidden">
      {isVisible && (
        <View className="w-full flex-1 items-center">
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
              source={bg_gallery}
              style={{
                width: scaleX(375),
                height: scaleX(725),
              }}
            />
          </MotiView>
          <View
            style={{ bottom: -insets.bottom }}
            className="absolute  h-32 w-full bg-primary"
          />
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
            style={{
              position: 'absolute',
              top: scaleY(250) + insets.top * 2,
              left: 0,
            }}
            transition={{
              opacity: { type: 'timing', duration: 50, delay: 50 },
              scale: { type: 'spring', damping: 40, stiffness: 300 },
            }}
          >
            <Image
              contentFit="contain"
              contentPosition="center"
              source={organiser}
              style={{ width: scaleX(250), height: scaleX(250) }}
            />
          </MotiView>
        </View>
      )}
    </View>
  );
}
