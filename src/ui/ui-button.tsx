import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { type PropsWithChildren, useCallback, useMemo } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { colors } from '@/config/theme';
import { UiText } from './ui-text';

type UiButtonProps = PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}>;

export function UiButton({
  onPress,
  disabled = false,
  loading = false,
  className = '',
  children,
  ...props
}: UiButtonProps) {
  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    impactAsync(ImpactFeedbackStyle.Medium);
    onPress?.();
  }, [disabled, onPress]);

  const content = useMemo(() => {
    if (typeof children === 'string') {
      return (
        <UiText className={twMerge('font-semibold', disabled ? 'text-text/20' : 'text-white')}>
          {children}
        </UiText>
      );
    }
    return children;
  }, [children, disabled]);

  return (
    <TouchableOpacity
      className={twMerge(
        'h-12 w-80 bg-primary rounded-full items-center justify-center',
        disabled ? 'bg-gray' : '',
        className
      )}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={disabled ? colors.primary.toString() : colors.white.toString()} />
      ) : (
        content
      )}
    </TouchableOpacity>
  );
}
