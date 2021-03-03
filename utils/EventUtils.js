var { DateTime, Interval } = require('luxon');
import fire from '../config/fire-config';

export const isPastEvent = (event) => {
  return DateTime.now().ts > event.endTs;
}

export const isLiveEvent = (event) => {
  let i = Interval.fromDateTimes(DateTime.fromMillis(event.startTs), DateTime.fromMillis(event.endTs));
  return i.contains(DateTime.now());
}

export const isChannelLive = (userName, callback) => {
  fire.firestore()
    .collection('events').where("userName", "==", userName)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(isLiveEvent(doc.data())) {
              callback();
            }
        });
        return false;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}