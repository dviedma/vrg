import fire from '../../config/fire-config';

export default function handler(req, res) {
  console.log(">>> Hi Hook req:", req.body);
  
  //if (req.method === 'POST' && (req.body.event == "video.started" || req.body.event == "video.stopped")) {
    console.log(">>> Adding object to DB");

    fire.auth()
      .signInWithEmailAndPassword("wowza@wowza.com", "Wowza123!")
      .then((result) => {
        fire.firestore()
        .collection('wowzaevents')
        .add({
          channelId: "test",
          event: "test"
        })
        .then((result) => {
          console.log("Success adding", result);
        })
        .catch((err) => {
          console.log(err.code, err.message)
        })    
      })
      .catch((err) => {
        console.log(err.code, err.message)
      })    

  //}
  
  res.status(200).json(req)
}