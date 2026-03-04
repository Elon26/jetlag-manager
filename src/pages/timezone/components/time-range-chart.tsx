import { scaleX } from '@kirz/nativewind-scale';
import { View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';

import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

const times = [3, 6, 9, 12, 15, 18, 21, 24];
const tick = 21 / 3;

type Props = {
  timezoneObj: Date;
  color: string;
  diff: number;
};

export default function TimeRangeChart({ timezoneObj, color, diff }: Props) {
  const timeNumber = timezoneObj.getHours() + timezoneObj.getMinutes() / 60;
  let timeNumberSinceThree = timeNumber - 3;
  if (timeNumberSinceThree < 0) timeNumberSinceThree += 24;
  let leftBorder = 0;
  let rightBorder = 0;
  if (diff >= 0) {
    rightBorder = timeNumberSinceThree;
    leftBorder = timeNumberSinceThree - diff;
  } else {
    leftBorder = timeNumberSinceThree;
    rightBorder = timeNumberSinceThree - diff;
  }
  let rightBorderForOtherLeftArea = 0;
  if (rightBorder > 24) {
    rightBorderForOtherLeftArea = rightBorder - 24;
  }
  let leftBorderForOtherRightArea = 0;
  if (leftBorder < 0) {
    leftBorderForOtherRightArea = leftBorder + 24;
  }

  return (
    <View className="relative">
      <View className="absolute top-20 w-full gap-y-1">
        <View className="flex-row justify-between">
          {times.map(() => (
            <View
              key={uuid()}
              className="flex-1 flex-row items-end justify-between"
            >
              <View className="h-2 w-px bg-gray" />
              <View className="h-1 w-px bg-gray" />
              <View className="h-1 w-px bg-gray" />
              <View className="h-1 w-px bg-gray" />
              <View className="h-1 w-px bg-gray" />
              <View className="" />
            </View>
          ))}
        </View>
        <View className="-ml-1 mr-3 flex-row justify-between">
          {times.map((time) => (
            <UiText
              key={uuid()}
              className={twMerge(
                'text-xs font-light text-gray',
                time === 6 && 'left-1',
                time === 9 && 'left-1.5',
                time === 12 && 'left-2',
                time === 15 && 'left-1.5',
                time === 18 && 'left-1',
                time === 21 && 'left-0.5'
              )}
            >
              {time}
            </UiText>
          ))}
        </View>
      </View>
      <View
        className="absolute top-0 h-31 w-px"
        style={{
          backgroundColor: color,
          left: scaleX(timeNumberSinceThree * tick),
        }}
      />
      <View className="absolute left-0 top-0 h-31 w-full" />
      {diff !== 0 && (
        <View className="absolute left-0 top-0 h-31 w-full">
          <Svg width="100%" height="100%">
            <Defs>
              <Pattern
                id="diagonalHatch"
                patternUnits="userSpaceOnUse"
                width={8}
                height={8}
              >
                <Line
                  x1="0"
                  y1="8"
                  x2="8"
                  y2="0"
                  stroke={color + '30'}
                  strokeWidth="1.5"
                />
              </Pattern>
            </Defs>

            <Rect
              x={scaleX(leftBorder * tick)}
              y="0"
              width={scaleX((rightBorder - leftBorder) * tick)}
              height="100%"
              fill="url(#diagonalHatch)"
              opacity={1}
            />
            {rightBorderForOtherLeftArea > 0 && (
              <Rect
                x="0"
                y="0"
                width={scaleX(rightBorderForOtherLeftArea * tick)}
                height="100%"
                fill="url(#diagonalHatch)"
                opacity={1}
              />
            )}
            {leftBorderForOtherRightArea > 0 && (
              <Rect
                x={scaleX(leftBorderForOtherRightArea * tick)}
                y="0"
                width={scaleX((leftBorderForOtherRightArea + diff) * tick)}
                height="100%"
                fill="url(#diagonalHatch)"
                opacity={1}
              />
            )}
          </Svg>
        </View>
      )}
    </View>
  );
}
