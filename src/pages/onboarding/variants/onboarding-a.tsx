import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import gallery from '@/images/onboarding/0-0.png';
import bg_gallery from '@/images/onboarding/0-1.png';
import tasks from '@/images/onboarding/0-2.png';
import bg_tasks from '@/images/onboarding/0-3.png';
import bg_planer from '@/images/onboarding/0-4.png';
import picker from '@/images/onboarding/0-5.png';
import { UiText } from '@/ui/ui-text';

import {
  OnboardingLayoutAnimation,
  type OnboardingSlide,
} from '../onboarding-layout-animation';

export default function OnboardingA() {
  const { t } = useTranslation();

  const slides: OnboardingSlide[] = [
    [
      Slide0,
      t('onboarding.a.slide0.title'),
      t('onboarding.a.slide0.description'),
    ],
    [
      Slide1,
      t('onboarding.a.slide1.title'),
      t('onboarding.a.slide1.description'),
    ],
    [
      Slide2,
      t('onboarding.a.slide2.title'),
      t('onboarding.a.slide2.description'),
    ],
  ];

  return <OnboardingLayoutAnimation slides={slides} />;
}

function Slide0({ slide }: { slide: number }) {
  const { t } = useTranslation();
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
            <UiText
              className="absolute  z-10 -translate-x-1/2 text-sm font-semibold text-white"
              style={{ top: scaleY(60), left: scaleY(89) }}
            >
              {t('onboarding.a.slide0.gallery-cleaner-title')}
            </UiText>
            <UiText
              className="absolute left-7.5 z-10 text-xs font-semibold text-white"
              style={{ top: scaleY(111) }}
            >
              {t('onboarding.a.slide0.gallery-cleaner-subtitle')}
            </UiText>
            <UiText
              className="absolute left-7.5 z-10 text-white opacity-60"
              style={{ top: scaleY(128), fontSize: scaleY(10) }}
            >
              {t('onboarding.a.slide0.gallery-cleaner-description')}
            </UiText>
            <UiText
              className="absolute z-10 font-medium text-black "
              style={{
                top: scaleY(160),
                left: scaleY(57),
                fontSize: scaleY(10),
              }}
            >
              {t('onboarding.a.slide0.feature-similar-photos')}
            </UiText>
            <UiText
              className="absolute z-10 font-medium text-black "
              style={{
                top: scaleY(210),
                left: scaleY(57),
                fontSize: scaleY(10),
              }}
            >
              {t('onboarding.a.slide0.feature-screenshots')}
            </UiText>
            <UiText
              className="absolute z-10 font-medium text-black "
              style={{
                top: scaleY(260),
                left: scaleY(57),
                fontSize: scaleY(10),
              }}
            >
              {t('onboarding.a.slide0.feature-blurry-photos')}
            </UiText>
            <UiText
              className="absolute z-10 font-medium text-black "
              style={{
                top: scaleY(310),
                left: scaleY(57),
                fontSize: scaleY(10),
              }}
            >
              {t('onboarding.a.slide0.feature-selfie')}
            </UiText>
            <UiText
              className="absolute z-10 font-medium text-black "
              style={{
                top: scaleY(360),
                left: scaleY(57),
                fontSize: scaleY(10),
              }}
            >
              {t('onboarding.a.slide0.feature-live-photos')}
            </UiText>
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

function Slide1({ slide }: { slide: number }) {
  const { t } = useTranslation();
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
              source={bg_tasks}
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
              source={tasks}
              style={{ width: scaleY(321), height: scaleY(387) }}
            />
            <View className="absolute">
              <UiText
                className="absolute z-10 font-medium text-black opacity-50"
                style={{
                  top: scaleY(36),
                  left: scaleY(149),
                  fontSize: scaleY(7),
                }}
              >
                {t('onboarding.a.slide1.task1-location')}
              </UiText>
              <UiText
                className="absolute z-10 font-medium text-black "
                style={{
                  top: scaleY(52),
                  left: scaleY(37),
                  fontSize: scaleY(14),
                }}
              >
                {t('onboarding.a.slide1.task1-title')}
              </UiText>
              <UiText
                className="absolute z-10  text-black opacity-60"
                style={{
                  top: scaleY(72),
                  left: scaleY(37),
                  fontSize: scaleY(8),
                }}
              >
                {t('onboarding.a.slide1.task1-description')}
              </UiText>
            </View>
            <View className="absolute">
              <UiText
                className="absolute z-10 font-medium text-black opacity-50"
                style={{
                  top: scaleY(124),
                  left: scaleY(149),
                  fontSize: scaleY(7),
                }}
              >
                {t('onboarding.a.slide1.task2-location')}
              </UiText>
              <UiText
                className="absolute z-10 font-medium text-black "
                style={{
                  top: scaleY(142),
                  left: scaleY(37),
                  fontSize: scaleY(14),
                }}
              >
                {t('onboarding.a.slide1.task2-title')}
              </UiText>
              <UiText
                className="absolute z-10  text-black opacity-60"
                style={{
                  top: scaleY(160),
                  left: scaleY(37),
                  fontSize: scaleY(8),
                }}
              >
                {t('onboarding.a.slide1.task2-description')}
              </UiText>
            </View>
            <View className="absolute">
              <UiText
                className="absolute z-10 font-medium text-black opacity-50"
                style={{
                  top: scaleY(210),
                  left: scaleY(149),
                  fontSize: scaleY(7),
                }}
              >
                {t('onboarding.a.slide1.task3-location')}
              </UiText>
              <UiText
                className="absolute z-10 font-medium text-black "
                style={{
                  top: scaleY(227),
                  left: scaleY(37),
                  fontSize: scaleY(14),
                }}
              >
                {t('onboarding.a.slide1.task3-title')}
              </UiText>
              <UiText
                className="absolute z-10  text-black opacity-60"
                style={{
                  top: scaleY(245),
                  left: scaleY(37),
                  fontSize: scaleY(8),
                }}
              >
                {t('onboarding.a.slide1.task3-description')}
              </UiText>
            </View>
            <View className="absolute">
              <UiText
                className="absolute z-10 font-medium text-black opacity-50"
                style={{
                  top: scaleY(297),
                  left: scaleY(149),
                  fontSize: scaleY(7),
                }}
              >
                {t('onboarding.a.slide1.task4-location')}
              </UiText>
              <UiText
                className="absolute z-10 font-medium text-black "
                style={{
                  top: scaleY(315),
                  left: scaleY(37),
                  fontSize: scaleY(14),
                }}
              >
                {t('onboarding.a.slide1.task4-title')}
              </UiText>
              <UiText
                className="absolute z-10  text-black opacity-60"
                style={{
                  top: scaleY(333),
                  left: scaleY(37),
                  fontSize: scaleY(8),
                }}
              >
                {t('onboarding.a.slide1.task4-description')}
              </UiText>
            </View>
          </MotiView>
        </>
      )}
    </View>
  );
}

export function Slide2({ slide }: { slide: number }) {
  const { t } = useTranslation();
  const isVisible = slide === 2;
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
              source={bg_planer}
              style={{ width: scaleX(375), height: scaleX(815) }}
            />
          </MotiView>
          <MotiView
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 0 }}
            from={{ opacity: 0, translateY: -1000 }}
            style={{ position: 'absolute', top: scaleY(310) }}
            transition={{
              opacity: { type: 'timing', duration: 300, delay: 50 },
              translateY: {
                type: 'spring',
                damping: 15,
                stiffness: 180,
                mass: 0.7,
                delay: 150,
              },
            }}
          >
            <UiText
              className="absolute left-1/2 z-10 -translate-x-1/2  text-black"
              style={{ top: scaleX(50) }}
            >
              {t('onboarding.a.slide2.calendar-title')}
            </UiText>
            <View
              className="absolute left-1/2 z-10 -translate-x-1/2 flex-row"
              style={{ gap: scaleX(20), top: scaleX(80) }}
            >
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-mon')}
              </UiText>
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-tue')}
              </UiText>
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-wed')}
              </UiText>
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-thu')}
              </UiText>
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-fri')}
              </UiText>
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-sat')}
              </UiText>
              <UiText className="text-xs text-gray">
                {t('onboarding.a.slide2.day-sun')}
              </UiText>
            </View>
            <Image
              contentFit="contain"
              contentPosition="center"
              source={picker}
              style={{ width: scaleX(380), height: scaleX(205) }}
            />
          </MotiView>
        </View>
      )}
    </View>
  );
}
