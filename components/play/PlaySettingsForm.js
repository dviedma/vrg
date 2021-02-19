import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QueryString from 'query-string';
import Cookies from 'js-cookie';

import * as PlaySettingsActions from '../../actions/playSettingsActions';
import { getCookieValues } from '../../utils/CookieUtils';
import CookieName from '../../constants/CookieName';

const playUrlParametersMap = {
  "signalingURL":"playSignalingURL",
  "applicationName":"playApplicationName",
  "streamName":"playStreamName"
}

const PlaySettingsForm = () => {

  const dispatch = useDispatch();
  const [ initialized, setInitialized ] = useState(false);
  const playSettings = useSelector ((state) => state.playSettings);
  const webrtcPlay = useSelector ((state) => state.webrtcPlay);


  // load play settings from cookie and URL on mount
  useEffect(() => {

    let cookieValues = getCookieValues(CookieName);
    let qs = QueryString.parse(window.location.search);
    let savedValues = { ...cookieValues, ...qs };

    for (let paramKey in playUrlParametersMap)
    {
      if (savedValues[playUrlParametersMap[paramKey]] != null)
      {
        switch(playUrlParametersMap[paramKey])
        {
          case "playSignalingURL":
            dispatch({type:PlaySettingsActions.SET_PLAY_SIGNALING_URL,signalingURL:savedValues[playUrlParametersMap[paramKey]]});
            break;
          case "playApplicationName":
            dispatch({type:PlaySettingsActions.SET_PLAY_APPLICATION_NAME,applicationName:savedValues[playUrlParametersMap[paramKey]]});
            break;
          case "playStreamName":
            dispatch({type:PlaySettingsActions.SET_PLAY_STREAM_NAME,streamName:savedValues[playUrlParametersMap[paramKey]]});
            break;
          default:
        }
      }
    }
    setInitialized(true);
  },[dispatch]);
      
  // save values to Cookie
  useEffect(() => {

    let cookieValues = getCookieValues(CookieName);
    for (let paramKey in playUrlParametersMap)
    {
      if (playSettings[paramKey] != null)
      {
        cookieValues[playUrlParametersMap[paramKey]] = playSettings[paramKey];
      }
    }
    Cookies.set(CookieName,escape(JSON.stringify(cookieValues)));

  },[playSettings]);

  if (!initialized)
    return null;

  return (
    <Fragment>
      { !webrtcPlay.connected && 
        <button id="play-toggle" type="button" className="btn"
          disabled={playSettings.playStarting }
          onClick={(e)=>dispatch(PlaySettingsActions.startPlay())}
        >Play</button>
      }
      { webrtcPlay.connected &&
        <button id="play-toggle" type="button" className="btn"
          onClick={(e)=>dispatch(PlaySettingsActions.stopPlay())}
        >Stop</button>
      }
    </Fragment>
  );
}

export default PlaySettingsForm;