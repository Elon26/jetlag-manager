import { scaleX } from '@kirz/nativewind-scale';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Pressable, type PressableProps, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { colors, shadows } from '@/config/theme';

import { SfSymbol } from './sf-symbol';

type CheckboxProps = {
  checked?: boolean | 'mix';
  onChange?: (checked: boolean) => void;
  label?: string;
  symbolClassName?: string;
  isSmall?: boolean;
} & Omit<PressableProps, 'children'>;

export function Checkbox({
  checked,
  onChange,
  className,
  symbolClassName,
  isSmall,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      className={twMerge(
        'items-center overflow-hidden rounded-md border-2 border-[#DCDCDC] bg-white/5',
        props.disabled && 'opacity-50',
        checked && 'border-0 border-transparent bg-[#438FF9]',
        isSmall ? 'size-4' : 'size-6',
        className
      )}
      style={shadows.lg}
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Light);
        onChange?.(!checked);
      }}
      {...props}
      hitSlop={5}
    >
      {checked === true && (
        // <Animated.View
        //   className="absolute inset-0 items-center justify-center rounded-full"
        //   entering={ZoomIn.springify().duration(250)}
        //   exiting={ZoomOut.duration(250)}
        // >
        //   <CheckedIcon />
        // </Animated.View>
        <View className="absolute inset-0 items-center justify-center rounded-full">
          <SfSymbol
            name="checkmark"
            size={scaleX(isSmall ? 8 : 16)}
            tintColor={colors.white.toString()}
            type="monochrome"
            weight="semibold"
          />
        </View>
      )}
      {checked === 'mix' && (
        <Animated.View
          className="absolute inset-0 items-center justify-center rounded-full"
          entering={ZoomIn.springify().duration(250)}
          exiting={ZoomOut.duration(250)}
        >
          <SfSymbol
            className={symbolClassName}
            name="minus"
            size={scaleX(isSmall ? 8 : 12)}
            tintColor={colors.white.toString()}
            type="monochrome"
            weight="semibold"
          />
        </Animated.View>
      )}
    </Pressable>
  );
}
