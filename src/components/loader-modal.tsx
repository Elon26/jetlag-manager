import { BlurView } from 'expo-blur';
import { View, useWindowDimensions } from 'react-native';

export function LoaderModal() {
  const { width, height } = useWindowDimensions();
  return (
    <View
      className="justify-center items-center bg-background/10"
      style={{
        width,
        height,
      }}
    >
      <BlurView className="absolute inset-0" intensity={20} tint="dark" />
      {/* <LottieView autoPlay className="h-44 w-56" source={LoaderAnimation} /> */}
    </View>
  );
}
