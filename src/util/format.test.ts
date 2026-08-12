import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dayjsInCity,
  formatCityTime,
  formatDayLabel,
  formatMpsToKmh,
  formatMtoKm,
  formatUnixDay,
} from './format';

describe('formatUnixDay', () => {
  beforeEach(() => {
    // Monday, 2024-01-15, local time
    vi.setSystemTime(new Date(2024, 0, 15, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Today" for a timestamp on the current day', () => {
    const unixDate = new Date(2024, 0, 15, 0, 0, 0).getTime() / 1000;

    expect(formatUnixDay(unixDate)).toBe('Today');
  });

  it('returns "Tomorrow" for a timestamp on the next day', () => {
    const unixDate = new Date(2024, 0, 16, 0, 0, 0).getTime() / 1000;

    expect(formatUnixDay(unixDate)).toBe('Tomorrow');
  });

  it('returns "ddd DD/MM" for any other day', () => {
    const unixDate = new Date(2024, 0, 20, 0, 0, 0).getTime() / 1000;

    expect(formatUnixDay(unixDate)).toBe('Sat 20/01');
  });
});

describe('dayjsInCity', () => {
  it('resolves the city-local date/time from an absolute timestamp and offset', () => {
    // 02:00 UTC on Jan 15 is still 21:00 on Jan 14 at UTC-5.
    const unixDate = Date.UTC(2024, 0, 15, 2, 0) / 1000;

    expect(dayjsInCity(unixDate, -18000).format('YYYY-MM-DD HH:mm')).toBe(
      '2024-01-14 21:00',
    );
    expect(dayjsInCity(unixDate, 10800).format('YYYY-MM-DD HH:mm')).toBe(
      '2024-01-15 05:00',
    );
  });
});

describe('formatDayLabel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('labels by the CITY-local day even when the browser-local day differs', () => {
    // 22:30 UTC on Jan 15: Cairo (UTC+3) is already 01:30 on Jan 16.
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, 22, 30)));

    // 07:00 UTC Jan 16 = 10:00 Jan 16 in Cairo -> the city's "Today".
    expect(formatDayLabel(Date.UTC(2024, 0, 16, 7, 0) / 1000, 10800)).toBe(
      'Today',
    );
    expect(formatDayLabel(Date.UTC(2024, 0, 17, 7, 0) / 1000, 10800)).toBe(
      'Tomorrow',
    );
    expect(formatDayLabel(Date.UTC(2024, 0, 20, 12, 0) / 1000, 10800)).toBe(
      'Sat 20/01',
    );
  });
});

describe('formatCityTime', () => {
  it('formats a timestamp on the city clock with the given template', () => {
    // 04:30 UTC = 07:30 in Cairo (UTC+3).
    const unixDate = Date.UTC(2024, 0, 15, 4, 30) / 1000;

    expect(formatCityTime(unixDate, 10800, 'h:mm A')).toBe('7:30 AM');
    expect(formatCityTime(unixDate, 10800, 'h A')).toBe('7 AM');
  });
});

describe('formatMtoKm', () => {
  it('converts meters to kilometers with one decimal place', () => {
    expect(formatMtoKm(5000)).toBe('5.0');
    expect(formatMtoKm(1500)).toBe('1.5');
    expect(formatMtoKm(10000)).toBe('10.0');
  });
});

describe('formatMpsToKmh', () => {
  it('converts meters per second to kilometers per hour with one decimal place', () => {
    expect(formatMpsToKmh(5)).toBe('18.0');
    expect(formatMpsToKmh(10)).toBe('36.0');
    expect(formatMpsToKmh(2.5)).toBe('9.0');
  });
});
