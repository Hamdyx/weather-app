import type { ForecastWeather, WeatherCondition } from './types';

import { dayjsInCity } from '@/util/format';

export const MAX_FORECAST_DAYS = 5;
export const SLOTS_PER_FULL_DAY = 8; // 8 x 3h slots

const NOON_HOUR = 12;

export interface DailyForecastDay {
  /** 'YYYY-MM-DD' in the city's local calendar. */
  dateKey: string;
  /** Timestamp of the representative slot (closest to city-local noon). */
  dt: number;
  weather: WeatherCondition[];
  temp: { min: number; max: number };
  slotCount: number;
}

/**
 * Groups 3-hourly forecast slots into calendar days on the CITY's clock,
 * using each slot's absolute timestamp plus the API-provided UTC offset —
 * never `dt_txt` (a UTC string) or the machine's local timezone.
 */
export function groupForecastByCityDay(
  list: ForecastWeather[],
  utcOffsetSeconds: number,
): DailyForecastDay[] {
  // Input is chronological; Map preserves insertion order, so buckets are too.
  const buckets = new Map<string, ForecastWeather[]>();

  for (const slot of list) {
    const dateKey = dayjsInCity(slot.dt, utcOffsetSeconds).format('YYYY-MM-DD');
    const bucket = buckets.get(dateKey);
    if (bucket) {
      bucket.push(slot);
    } else {
      buckets.set(dateKey, [slot]);
    }
  }

  const days: DailyForecastDay[] = Array.from(buckets.entries()).map(
    ([dateKey, slots]) => {
      let representative = slots[0];
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const slot of slots) {
        const hour = dayjsInCity(slot.dt, utcOffsetSeconds).hour();
        const distance = Math.abs(hour - NOON_HOUR);
        if (distance < bestDistance) {
          bestDistance = distance;
          representative = slot;
        }
      }

      // Aggregate the actual per-slot temperature; per-slot temp_min/temp_max
      // are OWM internal-deviation fields, not the day's range.
      const temps = slots.map((slot) => slot.main.temp);

      return {
        dateKey,
        dt: representative.dt,
        weather: representative.weather,
        temp: { min: Math.min(...temps), max: Math.max(...temps) },
        slotCount: slots.length,
      };
    },
  );

  // Drop a trailing sliver day; a leading partial day is "rest of today" and
  // stays.
  const lastDay = days[days.length - 1];
  if (days.length > 1 && lastDay.slotCount < SLOTS_PER_FULL_DAY) {
    days.pop();
  }

  return days.slice(0, MAX_FORECAST_DAYS);
}
