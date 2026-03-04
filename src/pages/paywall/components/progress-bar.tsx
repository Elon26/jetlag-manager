import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export default function ProgressBar() {
  const progress = useSharedValue(0.4);

  useEffect(() => {
    progress.value = withDelay(
      1200,
      withTiming(0.8, {
        duration: 1200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, []);
  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="h-6.5 w-78 overflow-hidden rounded-full bg-[#FFFFFF40]">
      <Animated.View
        style={animatedBarStyle}
        className="h-full overflow-hidden rounded-full"
      >
        <View className="absolute inset-0 bg-[#FF4343CF]" />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
          }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
          }}
        />
      </Animated.View>
    </View>
  );
}
