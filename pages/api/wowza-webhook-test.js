import {firebase} from '../../config/fire-config';

export default function handler(req, res) {

    console.log("Event", req.body);

    if (req.method == "POST" && (req.body.event == "video.started" || req.body.event == "video.stopped")) {

      console.log("adding to DB");
      firebase.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        event: req.body.event,
        timestamp: req.body.event_time
      })
      .then((result) => {
        console.log("Success adding");
      })
      .catch((err) => {
        console.log(err.code, err.message)
      })   
    }
 
  res.status(200).json(req)
}