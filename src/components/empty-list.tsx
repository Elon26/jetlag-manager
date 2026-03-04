import { UiText } from '@/ui/ui-text';
import { scaleX } from '@kirz/nativewind-scale';
import { Image, ImageSource } from 'expo-image';
import { MotiView } from 'moti';
import { StyleProp, View, ViewStyle } from 'react-native';

type EmptyListProps = {
  text: string;
  image?: any | ImageSource;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  textClassName?: string;
};

export function EmptyList({
  text,
  image,
  style,
  imageStyle,
  textClassName,
}: EmptyListProps) {
  return (
    <View style={style} className="flex-1 items-center gap-3 pt-28">
      <MotiView
        from={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        delay={300}
        transition={{ duration: 400 }}
        className="items-center justify-center"
      >
        {image && (
          <Image
            source={image}
            style={[
              {
                width: scaleX(340),
                height: scaleX(280),
              },
              imageStyle as any,
            ]}
            className="mb-6"
            contentFit="cover"
            contentPosition="center"
          />
        )}
        <UiText
          className={`text-lg font-medium text-[#D9D9D9] ${textClassName || ''}`}
        >
          {text}
        </UiText>
      </MotiView>
    </View>
  );
}
