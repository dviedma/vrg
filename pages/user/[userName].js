import fire from '../../config/fire-config';
import Link from 'next/link'
import { useDispatch } from 'react-redux';
import Iframe from 'react-iframe'

import Player from '../../components/play/Player';
import Chat from '../../components/chat/Chat';
import PlaySettingsForm from '../../components/play/PlaySettingsForm';
import * as PlaySettingsActions from '../../actions/playSettingsActions';

const User = (props) => {
  const dispatch = useDispatch();

  dispatch({type:PlaySettingsActions.SET_PLAY_SIGNALING_URL,signalingURL: props.wowza.sdpUrl});
  dispatch({type:PlaySettingsActions.SET_PLAY_APPLICATION_NAME,applicationName: props.wowza.applicationName});
  dispatch({type:PlaySettingsActions.SET_PLAY_STREAM_NAME,streamName: props.wowza.streamName});

  return (
    <div className="container-fluid mt-3" id="play-content">
      <div className="row">
        <div className="col-md-8 col-sm-12 pr-0">
          <div id="play-video-container" style={{height: 0,width: "100%",paddingBottom: "56%",backgroundColor: "rgba(102, 102, 102, 1)",borderRadius: "0.75em"}}>
            {/*          <div id="play-video-container" 
            style={{height: 0,width: "100%",paddingBottom: "57%",background: "url(https://media3.giphy.com/media/etUdXnsEMrBng0vOvY/200.gif) no-repeat",
            borderRadius: "0.75em",backgroundSize:"110%",backgroundPosition:"-10px" }}> */}
            <Player />   
            <PlaySettingsForm />                 
          </div>
          <h1>{props.userName}</h1>
            <p style={{fontWeight:'bold'}}>Lorem ipsum dolor amet | NBA | NFL In for the fun 🏈 🏀 🏏</p>
            {props.paypalMerchantId? 
            <div>
              Send Money to {props.userName}<br/>
              <Iframe url={'/paypal-button.html?paypalMerchantId=' + props.paypalMerchantId}
                width="300px"
                height="200px"
                id="myId"
                className="myClassname"
                display="initial"
                style={{border:'none'}}
                position="relative"/>
            </div> : ""
            }              
        </div>
        <div className="col-md-4 col-sm-12">
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