import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useRoute } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CalendarIcon from '@/svg/time-zone/calendar.svg';
import CalendarSelectedIcon from '@/svg/time-zone/calendar-selected.svg';
import ClipboardIcon from '@/svg/time-zone/clipboard.svg';
import ClipboardSelectedIcon from '@/svg/time-zone/clipboard-selected.svg';
import HomeIcon from '@/svg/time-zone/home.svg';
import HomeSelectedIcon from '@/svg/time-zone/home-selected.svg';
import PlusIcon from '@/svg/time-zone/plus.svg';
import PlusSelectedIcon from '@/svg/time-zone/plus-selected.svg';
import { Pressable } from '@/ui/pressable';

export default function TimezoneFooter() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const route = useRoute();

  const [currentPageName, setCurrentPageName] = useState('time-zone/index');

  useFocusEffect(
    useCallback(() => {
      setCurrentPageName(route.name);
    }, [])
  );

  return (
    <View
      className="absolute bottom-0 flex-row justify-between gap-x-2.5 rounded-2xl border-x-2 border-t-2 border-gray/20 bg-white px-edge py-2"
      style={{
        paddingBottom: insets.bottom,
        width,
      }}
    >
      <Pressable
        className="items-center justify-center"
        style={{ width: scaleX(74), height: scaleY(44) }}
        onPress={() => router.navigate('/timezone')}
      >
        {currentPageName === 'timezone/index' ? (
          <HomeSelectedIcon />
        ) : (
          <HomeIcon />
        )}
      </Pressable>
      <Pressable
        className="items-center justify-center"
        style={{ width: scaleX(74), height: scaleY(44) }}
        onPress={() => router.navigate('/timezone/time')}
      >
        {currentPageName === 'timezone/time' ? (
          <PlusSelectedIcon />
        ) : (
          <PlusIcon />
        )}
      </Pressable>
      <Pressable
        className="items-center justify-center"
        style={{ width: scaleX(74), height: scaleY(44) }}
        onPress={() => router.navigate('/timezone/calendar')}
      >
        {currentPageName === 'timezone/calendar' ? (
          <CalendarSelectedIcon />
        ) : (
          <CalendarIcon />
        )}
      </Pressable>
      <Pressable
        className="items-center justify-center"
        style={{ width: scaleX(74), height: scaleY(44) }}
        onPress={() => router.navigate('/timezone/note')}
      >
        {currentPageName === 'timezone/note' ? (
          <ClipboardSelectedIcon />
        ) : (
          <ClipboardIcon />
        )}
      </Pressable>
    </View>
  );
}
