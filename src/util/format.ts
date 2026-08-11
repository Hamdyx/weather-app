import dayjs from 'dayjs';

const METERS_PER_KILOMETER = 1000;
const SECONDS_PER_HOUR = 60 * 60;

export function formatUnixDay(unixDate: number) {
  const date = dayjs.unix(unixDate);
  const today = dayjs().startOf('day');

  if (date.isSame(today, 'day')) return 'Today';
  if (date.isSame(today.add(1, 'day'), 'day')) return 'Tomorrow';

  return `${date.format('ddd')} ${date.format('DD/MM')}`;
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
