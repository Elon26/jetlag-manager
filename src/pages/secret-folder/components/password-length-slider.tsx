import { scaleY } from '@kirz/nativewind-scale';
import { Slider } from '@miblanchard/react-native-slider';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { colors } from '@/config/theme';
import { UiText } from '@/ui/ui-text';

export type PasswordLengthSliderProps = {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
};

export function PasswordLengthSlider({
  value,
  onChange,
}: PasswordLengthSliderProps) {
  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    if (innerValue !== value) {
      impactAsync(ImpactFeedbackStyle.Light);
      onChange(innerValue);
    }
  }, [innerValue, onChange, value]);

  return (
    <View className="mx-2 mb-3">
      <View className="relative justify-center pb-2">
        <Slider
          maximumTrackTintColor="#D9D9D9"
          maximumValue={32}
          minimumTrackStyle={{
            height: scaleY(2.5),
            borderRadius: 1.5,
            backgroundColor: colors.primary.toString(),
            marginHorizontal: 2,
            marginTop: 1,
          }}
          minimumTrackTintColor={colors.primary.toString()}
          minimumValue={0}
          onValueChange={(v) => setInnerValue(v[0])}
          thumbTouchSize={{ width: 50, height: 50 }}
          renderThumbComponent={() => (
            <View
              className="z-30 size-8 items-center justify-center rounded-full bg-primary"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 2,
                zIndex: 30,
              }}
            >
              <UiText className="text-sm font-semibold text-white">
                {innerValue}
              </UiText>
            </View>
          )}
          step={1}
          thumbTintColor={colors.primary.toString()}
          trackStyle={{
            height: 5,
            borderRadius: 3,
            backgroundColor: '#D9D9D9',
          }}
          value={innerValue}
        />

        <View
          className="absolute inset-x-0 flex-row justify-between"
          style={{
            top: 7,
            zIndex: 20,
          }}
        >
          {[0, 16, 32].map((n) => (
            <View
              className="mt-2.5 size-1.5 rounded-full"
              key={n}
              style={{
                backgroundColor: colors.primary.toString(),
              }}
            />
          ))}
        </View>
      </View>

      <View className="-mt-2.5 flex-row justify-between">
        <UiText className="text-sm text-text">0</UiText>
        <UiText className="pl-2 text-sm text-text">16</UiText>
        <UiText className="text-sm text-text">32</UiText>
      </View>
    </View>
  );
}
