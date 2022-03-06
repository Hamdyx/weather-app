exports.formatUnixTime = d => {
  let timeStr = new Date(d * 1000).toLocaleTimeString();
  let [hours, minutes, t] = timeStr.split(':');
  let [seconds, time] = t.split(' ');
  return `${hours}:${minutes} ${time}`;
};

exports.formatUnixDay = d => {
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
};
