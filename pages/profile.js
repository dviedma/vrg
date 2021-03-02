import fire from '../config/fire-config';
import { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router'

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

  useEffect(() => {
    console.log(styles)
    
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
    });

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
            <ListEvents/>
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