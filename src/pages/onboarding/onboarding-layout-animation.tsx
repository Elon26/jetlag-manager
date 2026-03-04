import { useAnalytics } from '@kirz/expo-toolkit';
import { scaleX } from '@kirz/nativewind-scale';
import { getUIConfig } from '@pnlight/sdk-react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { router } from 'expo-router';
import {
  type ComponentType,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConfig } from '@/hooks/use-config';
import { useModals } from '@/hooks/use-modals';
import { useSetStorage } from '@/hooks/use-storage';
import { ButtonPrimary } from '@/ui/button-primary';
import { UiText } from '@/ui/ui-text';

export type OnboardingSlideComponent = ComponentType<{ slide: number }>;
export type OnboardingSlide = [OnboardingSlideComponent, string, string];

export function OnboardingLayoutAnimation({
  slides,
}: {
  slides: OnboardingSlide[];
}) {
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { logEvent } = useAnalytics();
  const { review_trigger } = useConfig();
  const setIsOnboardingFinished = useSetStorage('isOnboardingFinished');
  const { onboarding_id } = useConfig();
  const { openModal } = useModals();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    logEvent('af_app_launch');
  }, [logEvent]);

  const handleNext = useCallback(async () => {
    if (!pagerRef.current) return;

    impactAsync(ImpactFeedbackStyle.Light);

    if (currentPage < slides.length - 1) {
      pagerRef.current.setPage(currentPage + 1);
      logEvent(`af_onboarding_v${onboarding_id}_${currentPage + 1}`);
      setCurrentPage((prev) => prev + 1);
    } else {
      setIsOnboardingFinished(true);
      logEvent(`af_onboarding_v${onboarding_id}_finished`);

      const config = await getUIConfig('feature');
      if (config?.config) {
        router.replace('/onboarding-feature');
      } else {
        router.replace('/main');

        if (review_trigger === 'a') {
          setTimeout(() => {
            openModal('RateModal');
          }, 300);
        }
      }
    }
  }, [
    currentPage,
    slides.length,
    logEvent,
    onboarding_id,
    setIsOnboardingFinished,
    openModal,
  ]);

  const [, title = '', subtitle = ''] = slides[currentPage] ?? [];

  return (
    <View className="flex-1 bg-primary">
      <View
        className="absolute inset-x-0 items-center"
        style={{
          paddingTop: scaleX(60),
        }}
      >
        <View className="px-4">
          {!!title && (
            <Text
              className="text-center text-4xl font-semibold
              text-white"
            >
              {title}
            </Text>
          )}

          <Text className="px-2 pt-2 text-center text-1.5xl font-light text-white">
            {subtitle}
          </Text>
        </View>
      </View>

      <PagerView
        initialPage={0}
        onPageScroll={({ nativeEvent: { position, offset } }) => {
          animatedValue.value = position + offset;
        }}
        onPageSelected={({ nativeEvent: { position } }) =>
          setCurrentPage(position)
        }
        ref={pagerRef}
        style={{ flex: 1 }}
      >
        {slides.map(([Comp], i) => (
          <View
            className="flex-1 items-center justify-center"
            key={Comp.displayName || Comp.name || `slide-${i}`}
          >
            <Comp slide={currentPage} />
          </View>
        ))}
      </PagerView>

      <ButtonPrimary
        className="absolute inset-x-5 bottom-0 h-14 w-84 bg-white"
        onPress={handleNext}
        style={{ marginBottom: insets.bottom + scaleX(20) }}
      >
        <View className="flex-row">
          <UiText className="pr-2.5 text-xl font-semibold color-[#191919]">
            Continue
          </UiText>
        </View>
      </ButtonPrimary>
    </View>
  );
}
