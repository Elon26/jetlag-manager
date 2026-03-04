// import LoaderAnimation from '@/animations/loader.json';

// import { LottieView } from '@/ui/lottie';
import { Image } from 'expo-image';
import { View } from 'react-native';
import Splash from '@/images/splash.png';

export function AnimationLoader() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Image className="size-[125]" source={Splash} />
      <View className="absolute inset-x-0 bottom-20 justify-center items-center">
        {/* <LottieView autoPlay className="h-44 w-56" source={LoaderAnimation} /> */}
      </View>
    </View>
  );
}
