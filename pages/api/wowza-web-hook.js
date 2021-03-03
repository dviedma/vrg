import fire from '../../config/fire-config';

export default function handler(req, res) {
  if (req.method === 'POST') {
    fire.firestore()
      .collection('wowzaevents')
      .add({
        channelId: req.body.object_id,
        action: req.body.action
      });
  }
  res.status(200).json(req)
}