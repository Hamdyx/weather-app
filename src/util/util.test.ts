import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatMtoKm, formatSpeedMtoKm, formatUnixDay } from './util';

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

describe('formatMtoKm', () => {
  it('converts meters to kilometers with two decimal places', () => {
    expect(formatMtoKm(5000)).toBe('5.00');
    expect(formatMtoKm(1500)).toBe('1.50');
    expect(formatMtoKm(10000)).toBe('10.00');
  });
});

describe('formatSpeedMtoKm', () => {
  it('converts meters per second to kilometers per hour with two decimal places', () => {
    expect(formatSpeedMtoKm(5)).toBe('18.00');
    expect(formatSpeedMtoKm(10)).toBe('36.00');
    expect(formatSpeedMtoKm(2.5)).toBe('9.00');
  });
});
