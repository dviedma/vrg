import {firebase} from '../../config/fire-config';

export default function handler(req, res) {
  console.log("req.method", req.method, req.body.event);
  if (req.method == "POST" && (req.body.event == "video.started" || req.body.event == "video.stopped")) {
    console.log("adding to DB with req.body.event_time", req.body.event_time);
    firebase.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        event: req.body.event,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((result) => {
        console.log("Success adding", result);
      })
      .catch((err) => {
        console.log(err.code, err.message)
      })    
  }
  res.status(200).json(req)
}