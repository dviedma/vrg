import fire from '../config/fire-config';
import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'

import Publish from '../components/publish/Publish';
import * as PublishSettingsActions from '../actions/publishSettingsActions';

import CompositorUserMedia from '../components/media/CompositorUserMedia';
import Devices from '../components/media/Devices';
import CreateEvent from '../components/event/CreateEvent';
import ListEvents from '../components/event/ListEvents';

import styles from '../styles/profile.module.scss'

import wowza from '../config/wowza-config';

const Profile = (props) => {

  const [currentUser, setCurrentUser] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  const publishSettings = useSelector ((state) => state.publishSettings);

  useEffect(() => {
    console.log("useEffect");
    window.onbeforeunload = function(){
      return 'Leave the page will stop the live stream';
    };
    window.onunload = function() {
      dispatch(PublishSettingsActions.stopPublish());
      fetch('https://api.cloud.wowza.com/api/beta/live_streams/' + publishSettings.channelId + '/stop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'wsc-api-key': wowza.apiKey,
          'wsc-access-key': wowza.accessKey
        }
      })
    }
    
    // Get logged in state
    fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);

          fire.firestore()
            .collection('users').where("userName", "==", user.displayName)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach((doc) => {
                dispatch({type:PublishSettingsActions.SET_PUBLISH_SIGNALING_URL,signalingURL: doc.data().wowza.sdpUrl});
                dispatch({type:PublishSettingsActions.SET_PUBLISH_APPLICATION_NAME,applicationName: doc.data().wowza.applicationName});
                dispatch({type:PublishSettingsActions.SET_PUBLISH_STREAM_NAME,streamName: doc.data().wowza.streamName});
                dispatch({type:PublishSettingsActions.SET_PUBLISH_CHANNEL_ID,channelId: doc.data().wowza.channelId});
              });
            });          
          
        } else {
          router.push("/login")
        }
      })
    }, []);

  return (
    <Fragment>
      <div className="container-fluid mt-3">
        <CompositorUserMedia />
        <Devices />
        <h1 className={styles["myTitle"]}>Hi, {currentUser.displayName}</h1>
        <Publish />
      </div>
      <div className="container-fluid mt-3">        
        <div className="row">
          <div className="col-md-6">
            {currentUser.displayName && <ListEvents userName={currentUser.displayName}/>}
          </div>      
          <div className="col-md-6 ">   
            <CreateEvent/>
          </div>
        </div>
      </div>
    </Fragment>
    )
}

export default Profile;