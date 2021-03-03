import fire from '../../config/fire-config';

export default function handler(req, res) {
  console.log(">>> Hi Hook");
  
  if (req.method === 'POST') {
    console.log(">>> Adding object to DB");
    fire.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        action: req.body.action
      });
  }
  
  res.status(200).json(req)
}