import fire from '../../config/fire-config';
import Link from 'next/link'
import { useDispatch } from 'react-redux';
import Iframe from 'react-iframe'

import Play from '../../components/play/Play';
import * as PlaySettingsActions from '../../actions/playSettingsActions';

const User = (props) => {
  const dispatch = useDispatch();

  dispatch({type:PlaySettingsActions.SET_PLAY_SIGNALING_URL,signalingURL: props.wowza.sdpUrl});
  dispatch({type:PlaySettingsActions.SET_PLAY_APPLICATION_NAME,applicationName: props.wowza.applicationName});
  dispatch({type:PlaySettingsActions.SET_PLAY_STREAM_NAME,streamName: props.wowza.streamName});

  return (
    <div>
      <h2>{props.userName}'s channel</h2>
      <Play/>
      Send Money to {props.userName}
      <br/>
      <Iframe url="/paypal-button.html"
        width="300px"
        height="200px"
        id="myId"
        className="myClassname"
        display="initial"
        style={{border:'none'}}
        position="relative"/>
      <br/>  
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  )
}


export const getServerSideProps = async ({ query }) => {
  const content = {}
  
  await fire.firestore()
    .collection('users').where("userName", "==", query.userName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        content['userName'] = doc.data().userName;  //TODO use user's displayName
        content['wowza'] = doc.data().wowza;
      });
    });

  return {
    props: {
      userName: content.userName,
      wowza: content.wowza
    }
  }
}

export default User