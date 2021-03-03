var { DateTime, Interval } = require('luxon');

export const isPastEvent = (event) => {
  return DateTime.now().ts > event.endTs;
}

export const isLiveEvent = (event) => {
  let i = Interval.fromDateTimes(DateTime.fromMillis(event.startTs), DateTime.fromMillis(event.endTs));
  console.log(">>>i", i);
  return i.contains(DateTime.now());
}

