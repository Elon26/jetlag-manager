import type { ViewStyle } from 'react-native';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import Animated, {
  type SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

const DOT_ACTIVE_COLOR = '#FFFFFF';
const DOT_NO_ACTIVE_COLOR = '#FFFFFF30';
const DOT_ACTIVE_WIDTH = scaleX(36);
const DOT_INACTIVE_WIDTH = scaleX(8);
const DOT_HEIGHT = scaleY(8);

type AnimatedDotProps = {
  index: number;
  animatedValue: SharedValue<number>;
};

export function AnimatedDot({ index, animatedValue }: AnimatedDotProps) {
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [index - 1, index, index + 1],
      [DOT_NO_ACTIVE_COLOR, DOT_ACTIVE_COLOR, DOT_NO_ACTIVE_COLOR]
    );

    return {
      backgroundColor,

      width: interpolate(
        animatedValue.value,
        [index - 1, index, index + 1],
        [DOT_INACTIVE_WIDTH, DOT_ACTIVE_WIDTH, DOT_INACTIVE_WIDTH],
        'clamp'
      ),
      height: DOT_HEIGHT,
      borderRadius: 15,
      marginHorizontal: 5,
    };
  }, [animatedValue]);

  return <Animated.View className={twMerge('mx-1')} style={[animatedStyle]} />;
}
