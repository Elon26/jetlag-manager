import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradients } from '@/config/theme';
import { ButtonPrimary, type ButtonPrimaryProps } from './button-primary';
import { UiText } from './ui-text';

type BottomFloatProps = {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  buttonRightActive?: {
    label: string;
    onPress: () => void;
  };
  buttonRightInactive?: {
    label: string;
    onPress: () => void;
  };
  buttonRightIsActive?: boolean;
  buttonBottom: ButtonPrimaryProps;
  animated?: boolean;
};

export function BottomFloat({
  icon,
  title,
  subtitle,
  buttonRightActive,
  buttonRightInactive,
  buttonRightIsActive,
  buttonBottom,
  animated = false,
}: BottomFloatProps) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      className="absolute left-edge right-edge p-2.5 gap-4 bg-gray/25 rounded-4.5xl"
      entering={animated ? ZoomIn.duration(200) : undefined}
      style={{
        bottom: insets.bottom + scaleY(16),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: scaleX(32),
      }}
    >
      <View className="absolute inset-0 rounded-4.5xl overflow-hidden">
        <BlurView className="flex-1" intensity={25} tint="light" />
      </View>
      <View className="flex-row gap-2.5 items-center">
        {icon}
        <View className="gap-1 flex-1">
          <UiText className="font-medium w-full" numberOfLines={1}>
            {title}
          </UiText>
          <UiText className="text-sm opacity-50 w-full" numberOfLines={1}>
            {subtitle}
          </UiText>
        </View>
        {!buttonRightIsActive
          ? !!buttonRightInactive && (
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-full bg-[#262626]  gap-1 h-7 min-w-18 px-2"
                onPress={buttonRightInactive.onPress}
              >
                <UiText className="text-sm">{buttonRightInactive.label}</UiText>
              </TouchableOpacity>
            )
          : !!buttonRightActive && (
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-full gap-1 h-7 min-w-18 px-2 overflow-hidden"
                onPress={buttonRightActive.onPress}
              >
                <LinearGradient
                  colors={gradients.primary}
                  end={{ x: 0.9, y: 0 }}
                  start={{ x: 0.1, y: 1 }}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <UiText className="text-sm">{buttonRightActive.label}</UiText>
              </TouchableOpacity>
            )}
      </View>

      <ButtonPrimary {...buttonBottom} />
    </Animated.View>
  );
}
