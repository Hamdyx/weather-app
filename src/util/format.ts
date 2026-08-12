import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const METERS_PER_KILOMETER = 1000;
const SECONDS_PER_HOUR = 60 * 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;

/**
 * A dayjs instance pinned to the city's clock: an absolute unix timestamp
 * plus an explicit UTC offset never consults the machine's local timezone.
 *
 * dayjs quirk: `utcOffset()` treats arguments with |n| < 16 as HOURS, not
 * minutes — safe here because real-world offsets are 0 or >= 60 minutes.
 *
 * Never call `.startOf`/`.format` on a local-mode instance in this module;
 * only offset-mode instances (like the one returned here) are
 * machine-timezone independent.
 */
export function dayjsInCity(
  unixSeconds: number,
  utcOffsetSeconds: number,
): Dayjs {
  return dayjs
    .unix(unixSeconds)
    .utcOffset(utcOffsetSeconds / SECONDS_PER_MINUTE);
}

export function formatDayLabel(
  unixSeconds: number,
  utcOffsetSeconds: number,
): string {
  const date = dayjsInCity(unixSeconds, utcOffsetSeconds);
  const dateKey = date.format('YYYY-MM-DD');
  const nowInCity = dayjsInCity(
    Date.now() / MILLISECONDS_PER_SECOND,
    utcOffsetSeconds,
  );

  if (dateKey === nowInCity.format('YYYY-MM-DD')) return 'Today';
  if (dateKey === nowInCity.add(1, 'day').format('YYYY-MM-DD'))
    return 'Tomorrow';

  return `${date.format('ddd')} ${date.format('DD/MM')}`;
}

export function formatCityTime(
  unixSeconds: number,
  utcOffsetSeconds: number,
  template: string,
): string {
  return dayjsInCity(unixSeconds, utcOffsetSeconds).format(template);
}

export function formatMtoKm(meters: number) {
  const kilometers = meters / METERS_PER_KILOMETER;

  return kilometers.toFixed(1);
}

export function formatMpsToKmh(metersPerSecond: number) {
  const kilometersPerHour =
    (metersPerSecond * SECONDS_PER_HOUR) / METERS_PER_KILOMETER;

  return kilometersPerHour.toFixed(1);
}
