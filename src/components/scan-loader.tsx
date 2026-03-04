import { View } from 'react-native';

import LoaderAnimation from '@/animations/loader.json';
import { LottieView } from '@/ui/lottie';

export function Loader() {
  return (
    <View className="flex-1 items-center justify-center gap-10 pb-20">
      <LottieView autoPlay className="size-50" loop source={LoaderAnimation} />
    </View>
  );
}
