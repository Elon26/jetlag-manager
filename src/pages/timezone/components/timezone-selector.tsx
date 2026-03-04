import { scaleY } from '@kirz/nativewind-scale';
import moment from 'moment-timezone';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

import { shadows } from '@/config/theme';
import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';

import timezones from '../../../../i18n/timezones/timezones.json';
import { Timezone } from '../types/timezone';

type TimezoneSelectorProps = {
  selectedTimezone: null | Timezone;
  setSelectedTimezone: Dispatch<SetStateAction<Timezone | null>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};

export function TimezoneSelector({
  selectedTimezone,
  setSelectedTimezone,
  error,
  setError,
}: TimezoneSelectorProps) {
  const { t } = useTranslation();
  const inputRef = useRef<null | TextInput>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedTimezone?.label || '');
  const [timezonesToShow, setTimezonesToShow] = useState<Timezone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectTimezone(item: Timezone) {
    setSelectedTimezone(item);
    setIsDropdownOpen(false);
  }

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const allTimezones: Timezone[] = [];
      timezones.forEach((tz) => {
        tz.cities.forEach((city) => {
          allTimezones.push({
            label: `${city}, ${tz.country}`,
            value: tz.timezone,
            utc: moment.tz(tz.timezone).format('Z'),
          });
        });
      });
      allTimezones.sort((x, y) => {
        if (x.label < y.label) return -1;
        if (x.label > y.label) return 1;
        return 0;
      });
      const updatedTimezones = allTimezones.filter((tz) =>
        tz.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setTimezonesToShow(updatedTimezones);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <View>
      <Pressable
        className={twMerge(
          'h-13 flex-row items-center justify-between rounded-xl bg-white px-5 py-3',
          error ? 'border-2 border-red' : ''
        )}
        style={shadows.md}
        onPress={() => inputRef.current?.focus()}
      >
        <TextInput
          autoFocus
          className="text-base"
          ref={inputRef}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={t('timezone.country-name')}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={() => {
            setIsDropdownOpen(true);
            setError('');
          }}
        />
      </Pressable>
      {isDropdownOpen && (
        <View
          className="absolute left-0 top-16 z-20 max-h-60 w-full rounded-xl bg-white py-2"
          style={shadows.md}
        >
          {isLoading ? (
            <View className="h-60 w-full items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : timezonesToShow.length > 0 ? (
            <FlatList
              data={timezonesToShow}
              keyExtractor={() => uuid()}
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row justify-between gap-x-2 px-3 py-2"
                  onPress={() => {
                    setInputValue(item.label);
                    setError('');
                    handleSelectTimezone(item);
                  }}
                  key={uuid()}
                >
                  <UiText numberOfLines={1} className="flex-1">
                    {item.label}
                  </UiText>
                  <UiText>{item.utc}</UiText>
                </Pressable>
              )}
            />
          ) : (
            <UiText className="px-3 py-2">No results found</UiText>
          )}
        </View>
      )}
    </View>
  );
}
