import type { PropsWithChildren } from 'react';
import { BlurView } from 'expo-blur';
import { View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type BlurryBackdropProps = PropsWithChildren;

export function BlurryBackdrop({ children }: BlurryBackdropProps) {
  const { width, height } = useWindowDimensions();
  return (
    <View className="justify-center items-center" style={{ width, height }}>
      <Animated.View className="absolute inset-0" entering={FadeIn.duration(500)} exiting={FadeOut}>
        <BlurView className="absolute inset-0" intensity={10} tint="dark" />
      </Animated.View>
      {children}
    </View>
  );
}
