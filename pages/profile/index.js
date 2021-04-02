import {firebase} from '../../config/fire-config';
import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import Router from 'next/router';

import {useWarnIfUnsavedChanges} from '../../utils/exitPageWarning';

import * as PublishSettingsActions from '../../actions/publishSettingsActions';

import CompositorUserMedia from '../../components/media/CompositorUserMedia';
import Devices from '../../components/media/Devices';
import CreateEvent from '../../components/event/CreateEvent';
import ListEvents from '../../components/event/ListEvents';

import PublishVideoElement from '../../components/publish/PublishVideoElement';
import PublishLiveIndicator from '../../components/publish/PublishLiveIndicator';
import PublishSettingsForm from '../../components/publish/PublishSettingsForm';
import Publisher from '../../components/publish/Publisher';
import Chat from '../../components/chat/Chat';

import styles from '../../styles/profile.module.scss'


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
                // shared
                dispatch({type:PublishSettingsActions.SET_PUBLISH_STREAM_NAME,
                  streamName: doc.data().rtmp? 
                    doc.data().rtmp.streamName :
                    doc.data().wowza.streamName});
                dispatch({type:PublishSettingsActions.SET_PUBLISH_CHANNEL_ID,
                  channelId: doc.data().rtmp? 
                    doc.data().rtmp.channelId :
                    doc.data().wowza.channelId});

                // webRTC
                dispatch({type:PublishSettingsActions.SET_PUBLISH_SIGNALING_URL,signalingURL: doc.data().wowza.sdpUrl});
                dispatch({type:PublishSettingsActions.SET_PUBLISH_APPLICATION_NAME,applicationName: doc.data().wowza.applicationName});

                // rtmp
                if(doc.data().rtmp) {
                  dispatch({type:PublishSettingsActions.SET_PUBLISH_PRIMARY_SERVER,primaryServer: doc.data().rtmp.primaryServer});
                  dispatch({type:PublishSettingsActions.SET_PUBLISH_USERNAME,userName: doc.data().rtmp.userName});
                  dispatch({type:PublishSettingsActions.SET_PUBLISH_PASSWORD,password: doc.data().rtmp.password});
                }
              });
            });          
          
        } else {
          router.push("/login")
        }
      })
    }, [webrtcPublish.connected]);

  return (
    <Fragment>
      <div className="container-fluid mt-3 profile mb-3">
        <CompositorUserMedia />
        <Devices />
        <h1 style={{display:'inline', lineHeight:'60px'}} className={styles["myTitle"]}>Hi, {currentUser.displayName}</h1>
        <span className="ml-3"><a href={currentUser.displayName}>View Public Profile</a></span>
        <span className="ml-3"><a href="/profile/edit">Edit My Info</a> ✏️</span>
        <div id="publish-content">
          <div className="row justify-content-center">
            <div className="col-md-6 col-sm-12">
              <div id="publish-video-container">
                <PublishVideoElement />
                <PublishLiveIndicator />
              </div>
            </div>
            <div className="col-md-3 col-sm-12 mb-3">
              <Chat userName={currentUser.displayName}/>
            </div>
            <div className="col-md-3 col-sm-12" id="publish-settings">
              <PublishSettingsForm userName={currentUser.displayName}/>
            </div>        
          </div>
          <Publisher />
        </div>
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