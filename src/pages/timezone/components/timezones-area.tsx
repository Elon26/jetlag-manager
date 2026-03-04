import { View } from 'react-native';

import { TimezoneObj } from '../types/timezone-obj';
import TimezoneCard from './timezone-card';

type Props = {
  filteredTimezones: TimezoneObj[];
  currentTimeShift: number;
};

export default function TimezonesArea({
  filteredTimezones,
  currentTimeShift,
}: Props) {
  return (
    <View className="gap-y-2.5">
      {filteredTimezones.map((timezoneObj) => (
        <TimezoneCard
          key={timezoneObj.id}
          timezoneObj={timezoneObj}
          currentTimeShift={currentTimeShift}
          isInMainPage={false}
        />
      ))}
    </View>
  );
}
