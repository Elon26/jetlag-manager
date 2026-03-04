import Palette from './palette';
import { Timezone } from './timezone';

export type TimezoneObj = {
  id: string;
  timezone: Timezone;
  priority: number;
  color: Palette;
  isFirst: boolean;
};
