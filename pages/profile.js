import fire from '../config/fire-config';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router'
import Link from 'next/link'

import Publish from '../components/publish/Publish';
import * as PublishSettingsActions from '../actions/publishSettingsActions';

const Profile = (props) => {

  const [currentUser, setCurrentUser] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
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
    <div>
      <h1>Hi, {currentUser.displayName}</h1>
      <Publish />
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
    )
}

export default Profile;