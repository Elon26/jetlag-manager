import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { type PropsWithChildren, useEffect } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useModals } from '@/hooks/use-modals';

type ModalWrapperProps = PropsWithChildren<{
  backgroundImage?: string;
  className?: string;
}>;

export function ModalWrapper({ children, backgroundImage, className }: ModalWrapperProps) {
  const { width, height } = useWindowDimensions();
  const modal = useModals();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    KeyboardController.dismiss();
  }, []);

  return (
    <View style={{ width, height }}>
      <BlurView className="absolute inset-0" intensity={5} tint="dark" />
      <Pressable className="absolute inset-0" onPress={() => modal.closeAllModals()} />
      <Animated.View
        className={twMerge(
          'absolute inset-x-4 px-2.5 rounded-4.5xl bg-background pt-44 pb-4 overflow-hidden',
          className
        )}
        entering={FadeInDown.springify()}
        style={{
          bottom: insets.bottom + scaleY(32),
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: scaleX(32),
        }}
      >
        {backgroundImage && (
          <Image
            className="absolute inset-x-0 top-0 aspect-[1/2]"
            contentFit="contain"
            contentPosition="top center"
            source={backgroundImage}
          />
        )}
        {children}
      </Animated.View>
    </View>
  );
}
