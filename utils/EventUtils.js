var { DateTime, Interval } = require('luxon');
import {firebase} from '../config/fire-config';

export const isPastEvent = (event) => {
  return DateTime.now().ts > event.endTs;
}

export const isLiveEvent = (event) => {
  let i = Interval.fromDateTimes(DateTime.fromMillis(event.startTs), DateTime.fromMillis(event.endTs));
  return i.contains(DateTime.now());
}

/**
 * 
 * If event scheduled time is happening "now", return the event. Otherwise return false.
 * 
 * @param {*} userName 
 * @param {*} callback 
 */
export const isChannelLive = (userName, callback) => {
  firebase.firestore()
    .collection('events').where("userName", "==", userName)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(isLiveEvent(doc.data())) {
              callback(doc.data());
            }
        });
        return false;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}