import type { TextProps as RNTextProps } from 'react-native';
import { forwardRef, useMemo } from 'react';
import { Text as RNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type TextProps = RNTextProps & {
  className?: string;
};

export const UiText = forwardRef<Text, TextProps>(function Text(
  { className, children, ...props }: TextProps,
  ref
) {
  const textStyle = useMemo(
    () => twMerge('text-base font-normal text-text', className),
    [className]
  );

  return (
    // @ts-expect-error - ref type behaves strange
    <RNText allowFontScaling={false} className={textStyle} ref={ref} {...props}>
      {children}
    </RNText>
  );
});
