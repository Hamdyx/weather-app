import type { ForecastWeather } from './types';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatDayLabel } from '@/util/format';

import {
  MAX_FORECAST_DAYS,
  SLOTS_PER_FULL_DAY,
  groupForecastByCityDay,
} from './forecast';

const SECONDS_PER_SLOT = 3 * 60 * 60;
const CAIRO_OFFSET = 10800; // UTC+3
const API_SLOT_COUNT = 40; // the real /data/2.5/forecast returns 40 slots

function makeSlot(unixSeconds: number, temp: number): ForecastWeather {
  return {
    dt: unixSeconds,
    main: {
      temp,
      feels_like: temp,
      // Deliberately offset from temp: the grouping must aggregate main.temp,
      // not these OWM internal-deviation fields.
      temp_min: temp - 5,
      temp_max: temp + 5,
      pressure: 1012,
      humidity: 50,
    },
    weather: [
      { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    ],
    clouds: { all: 0 },
    wind: { speed: 3, deg: 180, gust: 5 },
    visibility: 10000,
    pop: 0,
    sys: { pod: 'd' },
    // Derived from UTC time for realism; the implementation must not read it.
    dt_txt: new Date(unixSeconds * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' '),
  };
}

function makeRun(
  startUnixSeconds: number,
  count = API_SLOT_COUNT,
  tempAt: (index: number) => number = () => 20,
): ForecastWeather[] {
  return Array.from({ length: count }, (_, index) =>
    makeSlot(startUnixSeconds + index * SECONDS_PER_SLOT, tempAt(index)),
  );
}

function utcSeconds(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
): number {
  return Date.UTC(year, month, day, hour, minute) / 1000;
}

describe('groupForecastByCityDay', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('regression: Cairo late evening produces unique days with no duplicate labels', () => {
    // 18:30 UTC = 21:30 in Cairo; the first API slot (21:00 UTC) is already
    // 00:00 on the city's NEXT day.
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, 18, 30)));
    const list = makeRun(utcSeconds(2024, 0, 15, 21));

    const days = groupForecastByCityDay(list, CAIRO_OFFSET);

    const dateKeys = days.map((day) => day.dateKey);
    expect(new Set(dateKeys).size).toBe(dateKeys.length);
    expect(days.length).toBeLessThanOrEqual(MAX_FORECAST_DAYS);

    // Today (city clock) has no remaining slots, so the first day is the
    // city's tomorrow.
    expect(days[0].dateKey).toBe('2024-01-16');

    const labels = days.map((day) => formatDayLabel(day.dt, CAIRO_OFFSET));
    expect(new Set(labels).size).toBe(labels.length);
    expect(labels[0]).toBe('Tomorrow');
    expect(labels).not.toContain('Today');
  });

  it('negative offset: drops the trailing sliver and never duplicates weekday labels', () => {
    const offset = -18000; // UTC-5
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, 12, 0)));
    // 40 slots from 12:00 UTC: 6 land on city Jan 15, then 4 full city days,
    // then a 2-slot sliver on city Jan 20.
    const list = makeRun(utcSeconds(2024, 0, 15, 12));

    const days = groupForecastByCityDay(list, offset);

    expect(days.map((day) => day.dateKey)).toEqual([
      '2024-01-15',
      '2024-01-16',
      '2024-01-17',
      '2024-01-18',
      '2024-01-19',
    ]);
    expect(days[days.length - 1].slotCount).toBe(SLOTS_PER_FULL_DAY);

    const labels = days.map((day) => formatDayLabel(day.dt, offset));
    expect(new Set(labels).size).toBe(labels.length);
    expect(labels).toEqual([
      'Today',
      'Tomorrow',
      'Wed 17/01',
      'Thu 18/01',
      'Fri 19/01',
    ]);
  });

  it('+6..+11 offset band: never duplicates "Today"', () => {
    const offset = 21600; // UTC+6
    // 19:00 UTC = 01:00 city time on Jan 16.
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, 19, 0)));
    const list = makeRun(utcSeconds(2024, 0, 15, 21));

    const days = groupForecastByCityDay(list, offset);
    const labels = days.map((day) => formatDayLabel(day.dt, offset));

    expect(labels.filter((label) => label === 'Today')).toHaveLength(1);
    expect(new Set(labels).size).toBe(labels.length);
    expect(days[0].dateKey).toBe('2024-01-16');
  });

  it('rolls dateKeys correctly across month and year boundaries', () => {
    const monthDays = groupForecastByCityDay(
      makeRun(utcSeconds(2024, 0, 31, 0), 16),
      0,
    );
    expect(monthDays.map((day) => day.dateKey)).toEqual([
      '2024-01-31',
      '2024-02-01',
    ]);

    const yearDays = groupForecastByCityDay(
      makeRun(utcSeconds(2023, 11, 31, 0), 16),
      0,
    );
    expect(yearDays.map((day) => day.dateKey)).toEqual([
      '2023-12-31',
      '2024-01-01',
    ]);
  });

  it('picks the slot closest to city-local noon when noon itself is missing', () => {
    // City-local hours 00, 03, 06, 09 — closest to noon is 09, not items[0].
    const list = makeRun(utcSeconds(2024, 0, 15, 0), 4);

    const days = groupForecastByCityDay(list, 0);

    expect(days).toHaveLength(1);
    expect(days[0].dt).toBe(utcSeconds(2024, 0, 15, 9));
  });

  it('breaks representative ties toward the earlier slot', () => {
    // Hours 09 and 15 are both 3 hours from noon; the earlier one wins.
    const list = [
      makeSlot(utcSeconds(2024, 0, 15, 9), 20),
      makeSlot(utcSeconds(2024, 0, 15, 15), 20),
    ];

    const days = groupForecastByCityDay(list, 0);

    expect(days[0].dt).toBe(utcSeconds(2024, 0, 15, 9));
  });

  it('aggregates min/max over the slots’ main.temp, not temp_min/temp_max', () => {
    const temps = [10, 8, 12, 15, 18, 17, 13, 11];
    const list = makeRun(
      utcSeconds(2024, 0, 15, 0),
      SLOTS_PER_FULL_DAY,
      (index) => temps[index],
    );

    const days = groupForecastByCityDay(list, 0);

    expect(days).toHaveLength(1);
    expect(days[0].temp).toEqual({ min: 8, max: 18 });
    expect(days[0].slotCount).toBe(SLOTS_PER_FULL_DAY);
  });

  it('keeps a leading partial bucket as the rest of today', () => {
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, 13, 0)));
    // 40 slots from 15:00 UTC: 3 remain on Jan 15, then 4 full days, then a
    // 5-slot sliver on Jan 20.
    const list = makeRun(utcSeconds(2024, 0, 15, 15));

    const days = groupForecastByCityDay(list, 0);

    expect(days[0].dateKey).toBe('2024-01-15');
    expect(days[0].slotCount).toBeLessThan(SLOTS_PER_FULL_DAY);
    expect(formatDayLabel(days[0].dt, 0)).toBe('Today');
    expect(days).toHaveLength(MAX_FORECAST_DAYS);
    expect(days.map((day) => day.dateKey)).not.toContain('2024-01-20');
  });
});
