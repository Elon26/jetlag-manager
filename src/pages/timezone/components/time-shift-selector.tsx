import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { LinearGradient } from 'expo-linear-gradient';
import { SetStateAction } from 'jotai';
import { Dispatch } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { uuid } from '@/utils/uuid';

type Props = {
  setCurrentTimeShift: Dispatch<SetStateAction<number>>;
};

export default function TimeShiftSelector({ setCurrentTimeShift }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: width, y: 0 }}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentTimeShift(x);
        }}
      >
        <View
          className="-ml-4 bg-white"
          style={{
            height: scaleY(70),
            width: width * 3,
            marginBottom: insets.bottom + scaleY(22),
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{ height: scaleY(70) }}
          >
            {[...new Array(12).keys()].map((num) => (
              <View
                key={uuid()}
                className="flex-1 flex-row items-center justify-between"
              >
                <View
                  className={twMerge(
                    'h-10',
                    num === 6 ? 'w-0.5 bg-primary' : 'w-px bg-gray'
                  )}
                />
                <View className="h-3 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="h-7 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="h-3 w-px bg-gray" />
                <View className="" />
              </View>
            ))}
          </View>
          <View
            className="h-px w-full bg-gray"
            style={{ bottom: scaleY(36) }}
          />
        </View>
      </ScrollView>

      <View className="absolute inset-0 h-full" style={{ width: scaleX(90) }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#ffffff', '#ffffff50']}
          style={{ position: 'absolute', inset: 0 }}
        />
      </View>
      <View
        className="absolute top-0 h-full"
        style={{ width: scaleX(90), left: width - scaleX(90) }}
      >
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={['#ffffff', '#ffffff50']}
          style={{ position: 'absolute', inset: 0 }}
        />
      </View>
    </View>
  );
}
