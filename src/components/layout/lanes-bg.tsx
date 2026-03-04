import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Rect,
  Mask as SkiaMask,
  vec,
} from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import NavigationMarker from '@/images/navigation-marker.png';

type LanesBgProps = {
  accentColor?: string;
};

export function LanesBg({ accentColor = 'rgba(217, 217, 217, 1)' }: LanesBgProps) {
  const originalWidth = 375;
  const originalHeight = 812;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const scaleFactorX = screenWidth / originalWidth;
  const scaleFactorY = screenHeight / originalHeight;
  const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

  const startColor = useSharedValue(accentColor);
  const endColor = useSharedValue(`${accentColor}00`);
  const gradientColors = useDerivedValue(() => [endColor.value, startColor.value]);
  useEffect(() => {
    startColor.value = withTiming(accentColor);
    endColor.value = withTiming(`${accentColor}00`);
  }, [accentColor, startColor, endColor]);

  return (
    <>
      <Canvas style={{ width: screenWidth, height: screenHeight }}>
        <Group transform={[{ scale: scaleFactorX }]}>
          <Rect height={originalHeight} width={originalWidth} x={0} y={0}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.15)']}
              end={vec(187.5, originalHeight)}
              start={vec(187.5, 0)}
            />
          </Rect>

          <Path path="M100.774 129H115L75.1684 812H50L100.774 129Z">
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(217, 217, 217, 0.3)']}
              end={vec(107.887, 812)}
              start={vec(107.887, 129)}
            />
          </Path>

          <Path path="M166.304 129H208.696L225 812H150L166.304 129Z">
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(217, 217, 217, 0.6)']}
              end={vec(187.5, 812)}
              start={vec(187.5, 129)}
            />
          </Path>

          <Group>
            <SkiaMask
              mask={<Path color="white" path="M166.304 129H208.696L225 812H150L166.304 129Z" />}
              mode="luminance"
            >
              <Path path="M166.304 129H208.696L225 424H150L166.304 129Z">
                <LinearGradient
                  colors={gradientColors}
                  end={vec(187.5, 424)}
                  positions={[0, 0.678035]}
                  start={vec(187.5, 129)}
                />
              </Path>
            </SkiaMask>
          </Group>

          <Path path="M260 129H274.226L325 812H299.831L260 129Z">
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(217, 217, 217, 0.3)']}
              end={vec(267.112, 812)}
              start={vec(267.112, 129)}
            />
          </Path>

          <Path path="M330 129H344.184L445 812H419.905L330 129Z">
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(217, 217, 217, 0.2)']}
              end={vec(337.091, 812)}
              start={vec(337.091, 129)}
            />
          </Path>

          <Path path="M45 129H30.8158L-70 812H-44.905L45 129Z">
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(217, 217, 217, 0.2)']}
              end={vec(37.9087, 812)}
              start={vec(37.9087, 129)}
            />
          </Path>
        </Group>
      </Canvas>
      <View
        className="absolute inset-x-0 items-center"
        style={{
          top: 330 * scaleFactor,
        }}
      >
        <Image
          className="size-64"
          source={NavigationMarker}
          style={{
            transform: [{ scale: scaleFactor }],
          }}
        />
      </View>
    </>
  );
}
