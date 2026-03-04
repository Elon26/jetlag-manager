import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

import { UiText } from './ui-text';

export type ButtonPrimaryProps = {
  onPress?: () => void;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
  color?: string;
  loading?: boolean;
  style?: TouchableOpacityProps['style'];
} & PropsWithChildren;

export function ButtonPrimary({
  onPress,
  disabled,
  label,
  labelClassName,
  className,
  children = null,
  loading,
  style,
}: ButtonPrimaryProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        'h-12 w-full flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary',
        disabled ? 'opacity-50' : 'opacity-100',
        className
      )}
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          {children}
          {label && (
            <UiText
              className={twMerge(
                'text-xl font-semibold text-white',
                labelClassName
              )}
            >
              {label}
            </UiText>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
