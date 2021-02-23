import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Iframe from 'react-iframe'

import fire from '../../config/fire-config';

import Player from '../../components/play/Player';
import Chat from '../../components/chat/Chat';
import PlaySettingsForm from '../../components/play/PlaySettingsForm';
import * as PlaySettingsActions from '../../actions/playSettingsActions';

const User = (props) => {
  const dispatch = useDispatch();

  dispatch({type:PlaySettingsActions.SET_PLAY_SIGNALING_URL,signalingURL: props.wowza.sdpUrl});
  dispatch({type:PlaySettingsActions.SET_PLAY_APPLICATION_NAME,applicationName: props.wowza.applicationName});
  dispatch({type:PlaySettingsActions.SET_PLAY_STREAM_NAME,streamName: props.wowza.streamName});

  useEffect(() => {
    window.addEventListener('message', function(e) {
      const data = JSON.parse(e.data);
      if(data.message == "PAYMENT SENT") {
        console.log("Payment Sent");
        confetti.start();
        var audio = new Audio('/sounds/applause.wav');
        audio.play();
        setTimeout(()=> {
          confetti.stop();
        }, 2000);
      }
    });
  });
 

  return (
    <div className="container-fluid mt-3" id="play-content">
      <div className="row">
        <div className="col-md-8 col-sm-12 play-video-container-wrapper">
          <div id="play-video-container" style={{height: 0,width: "100%",paddingBottom: "56%",backgroundColor: "rgba(102, 102, 102, 1)"}}>
          {/*<div id="play-video-container" 
            style={{height: 0,width: "100%",paddingBottom: "57%",background: "url(https://media1.giphy.com/media/l1J9EdzfOSgfyueLm/giphy.gif) no-repeat",
  borderRadius: "0.75em",backgroundSize:"110%",backgroundPosition:"-10px" }}>*/}
            <Player />   
            <PlaySettingsForm />                 
          </div>
          <div className="row mt-3">
            <div className="user-info col-sm-7">
              <h1>{props.userName}</h1>
              <p>Lorem ipsum dolor amet | NBA | NFL In for the fun 🏈 🏀 🏏</p>
            </div>
            <div className="user-payment col-sm-5">
              {props.paypalMerchantId? 
                <Fragment>
                  <p style={{fontWeight:'bold'}} className="mt-2 mb-0">Pay {props.userName}</p>
                  <Iframe url={'/paypal-button.html?paypalMerchantId=' + props.paypalMerchantId}
                    width="100%"
                    height="400px"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    style={{border:'none'}}
                    position="relative"/></Fragment>
              : ""
              }   
            </div>   
          </div>        
        </div>
        <div className="col-md-4 col-sm-12 pl-0">
          <Chat/>
          
        </div>        
      </div>
    </div>
  )
}

/*
export async function getStaticPaths() {
  return {
    paths: [
      { params: { userName: 'elviajeropolar' } }
    ],
    fallback: false
  };
}
*/

export const getServerSideProps = async ({ params }) => {
  const content = {}
  
  await fire.firestore()
    .collection('users').where("userName", "==", params.userName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        content['userName'] = doc.data().userName;  //TODO use user's displayName
        content['wowza'] = doc.data().wowza;
        content['paypalMerchantId'] = doc.data().paypalMerchantId? doc.data().paypalMerchantId : "";
      });
    });

  return {
    props: {
      userName: content.userName,
      wowza: content.wowza,
      paypalMerchantId: content.paypalMerchantId
    }
  }
}

export default User