import fire from '../../config/fire-config';

export default function handler(req, res) {
  console.log(">>> Hi Hook req:", req.body);
  
  if (req.method === 'POST' && (req.body.event == "video.started" || req.body.event == "video.stopped")) {
    console.log(">>> Adding object to DB");
    fire.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        event: req.body.event
      });
  }
  
  res.status(200).json(req)
}