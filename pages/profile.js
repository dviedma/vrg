import {firebase} from '../config/fire-config';
import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import Router from 'next/router';

import {useWarnIfUnsavedChanges} from '../utils/exitPageWarning';

import Publish from '../components/publish/Publish';
import * as PublishSettingsActions from '../actions/publishSettingsActions';

import CompositorUserMedia from '../components/media/CompositorUserMedia';
import Devices from '../components/media/Devices';
import CreateEvent from '../components/event/CreateEvent';
import ListEvents from '../components/event/ListEvents';

import styles from '../styles/profile.module.scss'


const Profile = (props) => {

  const [currentUser, setCurrentUser] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  const webrtcPublish = useSelector ((state) => state.webrtcPublish);

  useEffect(() => {
    useWarnIfUnsavedChanges(webrtcPublish.connected);
    
    // Get logged in state
    firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);

          firebase.firestore()
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
    }, [webrtcPublish.connected]);

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
          <div className="col-md-6 mt-3">   
            <CreateEvent/>
          </div>
        </div>
      </div>
    </Fragment>
    )
}

export default Profile;