import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iframe from 'react-iframe'

import fire from '../config/fire-config';
import {getLiveStreamState} from '../utils/LiveStreamUtils';
import {isChannelLive} from '../utils/EventUtils';

import Player from '../components/play/Player';
import Chat from '../components/chat/Chat';
import * as PlaySettingsActions from '../actions/playSettingsActions';

const User = (props) => {
  const dispatch = useDispatch();
  const live = useSelector ((state) => state.live);


  const [isChatActive, setChatActive] = useState(false);
  const [isPaypalActive, setPaypalActive] = useState(false);
  const [channelLive, setChannelLive] = useState(false);

  dispatch({type:PlaySettingsActions.SET_PLAY_SIGNALING_URL,signalingURL: props.wowza.sdpUrl});
  dispatch({type:PlaySettingsActions.SET_PLAY_APPLICATION_NAME,applicationName: props.wowza.applicationName});
  dispatch({type:PlaySettingsActions.SET_PLAY_STREAM_NAME,streamName: props.wowza.streamName});

  useEffect(() => {
    isChannelLive(props.userName, (event)=> {
      setChannelLive(event);
    })

    // Get Live Stream State
    getLiveStreamState(props.wowza.channelId, (data)=> {
      if(data.live_stream.state == "started") {
        console.log("START PLAY!");
        dispatch(PlaySettingsActions.startPlay());
      }        
    });

    // Listen for Payment Event
    window.addEventListener('message', function(e) {
      const data = (typeof e.data === 'object')? e.data: JSON.parse(e.data);
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
  },[live]);
  

  return (
    <div className="container-fluid mt-3" id="play-content">
      <div className="row" style={{height:'calc(100vh - 70px)'}}>         
        <div className="col-md-7 play-video-container-wrapper">
          <div id="play-video-container" style={{height: 0,width: "100%",paddingBottom: "56%",backgroundColor: "rgba(102, 102, 102, 1)"}}>
            <Player channelId={props.wowza.channelId}/>                  
          </div>
          <div className="user-info ">
            <h1>{props.userName} {channelLive && ("LIVE " + channelLive.title)}</h1>
            <p>Lorem ipsum dolor amet | NBA | NFL In for the fun 🏈 🏀 🏏</p>
          </div>     
        </div>
        <div className={`col-md-3 col-8 pl-0 ${isChatActive ? "chat-active" : ""}`} id="chat-container" onClick={() => setChatActive(!isChatActive)}>
          <Chat userName={props.userName} chatId={props.eventId}/>        
        </div> 
        <div className={`col-md-2 col-4 pl-0 ${isPaypalActive ? "paypal-active" : ""}`} id="paypal-container" onClick={() => setPaypalActive(!isPaypalActive)}>
          <div className="user-payment">
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
        content['userId'] = doc.id;  //TODO use user's displayName
        content['wowza'] = doc.data().wowza;
        content['paypalMerchantId'] = doc.data().paypalMerchantId? doc.data().paypalMerchantId : "";
      });
    });

  return {
    props: {
      userName: content.userName,
      userId: content.userId,
      wowza: content.wowza,
      paypalMerchantId: content.paypalMerchantId,
      eventId: params.userName[1]? params.userName[1] : 0     //DV: not in use  
    }
  }
}

export default User