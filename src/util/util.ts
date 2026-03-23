import dayjs from 'dayjs';

export function formatUnixDay(unixDate: number) {
  const date = dayjs.unix(unixDate);
  const today = dayjs().startOf('day');

  if (date.isSame(today, 'day')) return 'Today';
  if (date.isSame(today.add(1, 'day'), 'day')) return 'Tomorrow';

  return `${date.format('ddd')} ${date.format('DD/MM')}`;
}

export function formatMtoKm(meters: number) {
  const kilometers = meters / 1000;

  return kilometers.toFixed(2);
}

export function formatSpeedMtoKm(metersPerSecond: number) {
  const kilometersPerHour = (metersPerSecond * 60 * 60) / 1000;

  return kilometersPerHour.toFixed(2);
}
