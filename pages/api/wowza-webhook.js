import fire from '../../config/fire-config';

export default function handler(req, res) {
  console.log("req.method", req.method, req.body.event);
  if (req.method == "POST") {
    console.log("adding to DB", req.body);
    fire.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        event: req.body.event,
        timestamp: req.body.event_time
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