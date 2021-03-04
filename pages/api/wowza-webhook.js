import fire from '../../config/fire-config';

export default function handler(req, res) {
  if (req.method === 'POST' && (req.body.event == "video.started" || req.body.event == "video.stopped")) {
    fire.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        event: req.body.event
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