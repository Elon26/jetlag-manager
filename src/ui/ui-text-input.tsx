import type { PropsWithChildren } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { UiText } from './ui-text';

type InputProps = {
  label: string;
  inputSuffix?: string;
  inputPrefix?: string;
} & TextInputProps &
  PropsWithChildren;

export function UiTextInput({
  label,
  placeholder,
  inputPrefix,
  inputSuffix,
  className,
  children,
  ...rest
}: InputProps) {
  return (
    <View className="h-20 flex-row items-center justify-between gap-4 ">
      <View className="flex-1 gap-2">
        <UiText className="text-sm font-medium">{label}</UiText>
        <View className="flex-row  rounded-2xl bg-gray-200 ">
          {inputPrefix && <UiText className="text-text">{inputPrefix}</UiText>}
          <TextInput
            className={twMerge('flex-1 p-4 text-text', 'placeholder:text-text/50', className)}
            placeholder={placeholder}
            {...rest}
          />
          {inputSuffix && <UiText className="text-text">{inputSuffix}</UiText>}
        </View>
      </View>
      {children}
    </View>
  );
}
