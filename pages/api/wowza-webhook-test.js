import fire from '../../config/fire-config';

export default function handler(req, res) {
  //console.log("fire", fire);

  //if (req.method == "POST") {
    console.log("adding to DB with req.body.event_time", req.body.event_time);
    fire.firestore()
      .collection('wowzaevents')
      .add({
        channelId: "test",
        event: "test",
        timestamp: "test"
      })
      .then((result) => {
        console.log("Success adding");
      })
      .catch((err) => {
        console.log(err.code, err.message)
      })    
  //}
  res.status(200).json(req)
}