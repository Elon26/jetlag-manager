import { scaleX } from '@kirz/nativewind-scale';
import { router } from 'expo-router';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { shadows } from '@/config/theme';
import { useModals } from '@/hooks/use-modals';
import { useStorageValue } from '@/hooks/use-storage';
import MoonIcon from '@/svg/time-zone/moon.svg';
import SunIcon from '@/svg/time-zone/sun.svg';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

import { TimezoneObj } from '../types/timezone-obj';
import TimeRangeChart from './time-range-chart';

type Props = {
  timezoneObj: TimezoneObj;
  currentTimeShift: number;
  isInMainPage: boolean;
};

export default function TimezoneCard({
  timezoneObj,
  currentTimeShift,
  isInMainPage,
}: Props) {
  const { width } = useWindowDimensions();
  const savedTimezones = useStorageValue('savedTimezones');
  const { openModal, closeModal } = useModals();
  const { t } = useTranslation();

  const timeUTCSigh = timezoneObj.timezone.utc[0];
  const hoursUTCDiff = Number(timezoneObj.timezone.utc.slice(1, 3));
  const minutesUTCDiff = Number(timezoneObj.timezone.utc.slice(4, 6));
  const [currentTimezoneTimeObject, setCurrentTimezoneTimeObject] = useState(
    new Date()
  );
  const [cardTimezoneTimeObject, setCardTimezoneTimeObject] = useState(
    new Date(
      currentTimezoneTimeObject.getUTCFullYear(),
      currentTimezoneTimeObject.getUTCMonth(),
      currentTimezoneTimeObject.getUTCDate(),
      timeUTCSigh === '+'
        ? currentTimezoneTimeObject.getUTCHours() + hoursUTCDiff
        : currentTimezoneTimeObject.getUTCHours() - hoursUTCDiff,
      timeUTCSigh === '+'
        ? currentTimezoneTimeObject.getUTCMinutes() + minutesUTCDiff
        : currentTimezoneTimeObject.getUTCMinutes() - minutesUTCDiff
    )
  );
  const [isDayNow, setIsDayNow] = useState(
    cardTimezoneTimeObject.getHours() >= 6 &&
      cardTimezoneTimeObject.getHours() < 18
  );
  const [timeToShow, setTimeToShow] = useState(
    `${cardTimezoneTimeObject.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  );
  const diff = caclDiff();

  function caclDiff() {
    const currentTimezoneText =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTimezone = moment.tz(currentTimezoneText).format('Z');
    const currentTimezoneSigh = currentTimezone[0];
    const currentTimezoneHours = Number(currentTimezone.slice(1, 3));
    const currentTimezoneMinutes = Number(currentTimezone.slice(4, 6));
    let currentTimezoneNumber =
      currentTimezoneHours + currentTimezoneMinutes / 60;
    if (currentTimezoneSigh === '-') currentTimezoneNumber *= -1;

    const cardTimezone = timezoneObj.timezone.utc;
    const cardTimezoneSigh = cardTimezone[0];
    const cardTimezoneHours = Number(cardTimezone.slice(1, 3));
    const cardTimezoneMinutes = Number(cardTimezone.slice(4, 6));
    let cardTimezoneNumber = cardTimezoneHours + cardTimezoneMinutes / 60;
    if (cardTimezoneSigh === '-') cardTimezoneNumber *= -1;

    return cardTimezoneNumber - currentTimezoneNumber;
  }

  useEffect(() => {
    setCurrentTimezoneTimeObject(new Date());
    setCardTimezoneTimeObject(
      new Date(
        currentTimezoneTimeObject.getUTCFullYear(),
        currentTimezoneTimeObject.getUTCMonth(),
        currentTimezoneTimeObject.getUTCDate(),
        timeUTCSigh === '+'
          ? currentTimezoneTimeObject.getUTCHours() + hoursUTCDiff
          : currentTimezoneTimeObject.getUTCHours() - hoursUTCDiff,
        timeUTCSigh === '+'
          ? currentTimezoneTimeObject.getUTCMinutes() + minutesUTCDiff
          : currentTimezoneTimeObject.getUTCMinutes() - minutesUTCDiff
      )
    );
    setIsDayNow(
      cardTimezoneTimeObject.getHours() >= 6 &&
        cardTimezoneTimeObject.getHours() < 18
    );
    setTimeToShow(
      `${cardTimezoneTimeObject.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    );
  }, [savedTimezones]);

  return (
    <Pressable
      onPress={() =>
        isInMainPage
          ? router.navigate('/timezone/time')
          : openModal('EditTimezoneModal', {
              timezoneObjId: timezoneObj.id,
              close: () => closeModal('EditTimezoneModal'),
            })
      }
      style={shadows.md}
    >
      <View
        className={twMerge(
          ' h-32 flex-row overflow-hidden rounded-3xl border-2 bg-white',
          timezoneObj.isFirst ? 'border-primary' : 'border-white'
        )}
      >
        <View className="w-1/2 justify-between gap-y-0.5 py-5 pl-5">
          <View className="mr-5">
            <View className="flex-row items-center gap-x-2">
              <UiText numberOfLines={1} className="font-bold">
                {timezoneObj.timezone.label}
              </UiText>
              {isDayNow ? <SunIcon /> : <MoonIcon />}
            </View>
            <UiText className="text-xs font-light text-gray">
              {`${t('timezone.gmt')}${timeUTCSigh}${hoursUTCDiff}${minutesUTCDiff > 0 ? ':' + minutesUTCDiff : ''}`}
            </UiText>
            <View className="flex-row items-center gap-x-0.5">
              <UiText className="text-xs font-light text-gray">{`${currentTimezoneTimeObject.getDate()} ${currentTimezoneTimeObject.toLocaleDateString('default', { month: 'short' })}`}</UiText>
              {currentTimezoneTimeObject.getDate() !==
                cardTimezoneTimeObject.getDate() && (
                <View className="flex-row items-center gap-x-0.5">
                  <SfSymbol
                    className="size-2"
                    name="arrow.right"
                    weight="light"
                    style={{ color: timezoneObj.color }}
                  />
                  <UiText
                    className="text-xs font-light"
                    style={{ color: timezoneObj.color }}
                  >
                    {`${cardTimezoneTimeObject.getDate()} ${cardTimezoneTimeObject.toLocaleDateString('default', { month: 'short' })}`}
                  </UiText>
                </View>
              )}
            </View>
          </View>
          <View className="flex-row items-center gap-x-1.5">
            <UiText className="text-xl font-bold">{timeToShow}</UiText>
            {diff !== 0 && (
              <UiText
                className="rounded-2xl bg-red/10 px-1.5 py-1 text-sm font-medium"
                style={{
                  color: timezoneObj.color,
                  backgroundColor: timezoneObj.color + '20',
                }}
              >{`${diff > 0 ? '+' : ''}${diff}${t('timezone.h')}`}</UiText>
            )}
          </View>
        </View>
        <View className="overflow-hidden" style={{ width: scaleX(170) }}>
          <View
            style={{
              left: -(((currentTimeShift - width) / width) * 170 + scaleX(3)),
            }}
          >
            <View>
              <TimeRangeChart
                timezoneObj={cardTimezoneTimeObject}
                color={timezoneObj.color}
                diff={diff}
              />
            </View>
            <View
              className="absolute top-0 size-full"
              style={{ left: -scaleX(170) }}
            >
              <TimeRangeChart
                timezoneObj={cardTimezoneTimeObject}
                color={timezoneObj.color}
                diff={diff}
              />
            </View>
            <View
              className="absolute top-0 size-full"
              style={{ right: -scaleX(170) }}
            >
              <TimeRangeChart
                timezoneObj={cardTimezoneTimeObject}
                color={timezoneObj.color}
                diff={diff}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
