import CityTimezones from 'city-timezones';
import moment from 'moment-timezone';

import { uuid } from '@/utils/uuid';

import Palette from '../types/palette';
import { TimezoneObj } from '../types/timezone-obj';

export default async function createFirstTimezone(): Promise<TimezoneObj | null> {
  try {
    const res = await fetch('https://ipinfo.io/json');
    const data = await res.json();
    const geoObj = CityTimezones.findFromCityStateProvince(data.city)[0];

    return {
      id: uuid(),
      priority: 1,
      color: Palette.blue,
      timezone: {
        label: `${geoObj.city}, ${geoObj.country}`,
        value: data.timezone,
        utc: moment.tz(data.timezone).format('Z'),
      },
      isFirst: true,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
