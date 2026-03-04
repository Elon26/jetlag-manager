import { scaleY } from '@kirz/nativewind-scale';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Layout } from '@/components/layout';
import { useStorageValue } from '@/hooks/use-storage';
import ArrowLeftIcon from '@/svg/back.svg';
import { Pressable } from '@/ui/pressable';

import FullCalendarArea from './components/full-calendar-area';
import ShortCalendarArea from './components/short-calendar-area';
import TimeShiftSelector from './components/time-shift-selector';
import TimeZoneFooter from './components/timezone-footer';
import TimezonesArea from './components/timezones-area';

export default function TimeZoneMainPage() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);
  const [currentTimeShift, setCurrentTimeShift] = useState(width);
  const navigation = useNavigation();

  const savedTimezones = useStorageValue('savedTimezones');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View className="flex-row gap-x-2">
            <Pressable onPress={() => router.navigate('/main')}>
              <ArrowLeftIcon />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  return (
    <Layout className="flex-1 gap-y-2.5 overflow-visible px-4">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom || scaleY(32),
        }}
        showsVerticalScrollIndicator={false}
        className="overflow-visible"
      >
        <View className="gap-y-2.5">
          <View>
            {isFullCalendarOpen ? (
              <FullCalendarArea
                selectedDay={new Date()}
                setSelectedDay={() => {}}
                setIsCalendarOpen={setIsFullCalendarOpen}
              />
            ) : (
              <ShortCalendarArea
                selectedDay={new Date()}
                setSelectedDay={() => {}}
                setIsCalendarOpen={setIsFullCalendarOpen}
              />
            )}
          </View>
          <TimezonesArea
            filteredTimezones={savedTimezones}
            currentTimeShift={currentTimeShift}
          />
        </View>
      </ScrollView>

      <TimeShiftSelector setCurrentTimeShift={setCurrentTimeShift} />
      <TimeZoneFooter />
    </Layout>
  );
}
