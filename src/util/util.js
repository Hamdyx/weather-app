export function formatUnixTime(d) {
  let timeStr = new Date(d * 1000).toLocaleTimeString();
  let [hours, minutes, t] = timeStr.split(':');
  let [, time] = t.split(' ');
  return `${hours}:${minutes} ${time}`;
}

export function formatUnixDay(d) {
  const today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (new Date(d * 1000).toLocaleDateString() === today.toLocaleDateString()) {
    return 'Today';
  } else if (
    new Date(d * 1000).toLocaleDateString() === tomorrow.toLocaleDateString()
  ) {
    return 'Tomorrow';
  }
  let dateStr = new Date(d * 1000).toDateString();
  let dateSp = dateStr.split(' ');
  return `${dateSp[0]}`;
}

export function formatMtoKm(m) {
  let km = m / 1000;
  if (km % 10 === 0) {
    return km;
  } else return km.toFixed(2);
}

export function formatSpeedMtoKm(ms) {
  let kmh = (ms * 60 * 60) / 1000;
  if (kmh % 10 === 0) {
    return kmh;
  } else return kmh.toFixed(2);
}
