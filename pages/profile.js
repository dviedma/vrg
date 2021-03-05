import fire from '../config/fire-config';
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

  /*
  const message = 'Do you want to leave?',
  unsavedChanges = true;

  useEffect(() => {
    const routeChangeStart = url => {
      if (Router.asPath !== url && unsavedChanges && !confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const beforeunload = e => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', beforeunload);
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  });
  */

  useEffect(() => {
    console.log("webrtcPublish.connected", webrtcPublish.connected);
    useWarnIfUnsavedChanges(webrtcPublish.connected);
    
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
    }, [webrtcPublish.connected]);

  return (
    <Fragment>
      <div className="container-fluid mt-3" id="myElement">
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