import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as PublishSettingsActions from '../../actions/publishSettingsActions';
import * as WebRTCPublishActions from '../../actions/webrtcPublishActions';
import PublishAudioDropdown from './PublishAudioDropdown';
import PublishVideoDropdown from './PublishVideoDropdown';

import {getLiveStreamState} from '../../utils/LiveStreamUtils';

import wowza from '../../config/wowza-config';

const PublishSettingsForm = () => {

  const dispatch = useDispatch();
  const [startingLiveStream, setStartingLiveStream] = useState(false);
  const publishSettings = useSelector ((state) => state.publishSettings);
  const webrtcPublish = useSelector ((state) => state.webrtcPublish);
  let timer;


  return (
      <form id="publish-settings-form">
        {publishSettings.primaryServer? 
        <Fragment>
          <div className="row">
            <div className="col-10">
              <label className="form-label">Server</label>
              <input className="form-control" value={publishSettings.primaryServer}/>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-10">
              <label className="form-label">Stream Key</label>
              <input className="form-control" value={publishSettings.streamName}/>
            </div>
          </div>   
          <div className="row mt-3">
            <div className="col-10">
              <label className="form-label">Username</label>
              <input className="form-control" value={publishSettings.userName}/>
            </div>
          </div>   
          <div className="row mt-3 mb-4">
            <div className="col-10">
              <label className="form-label">Password</label>
              <input className="form-control" value={publishSettings.password}/>
            </div>
          </div>                              
        </Fragment> :        
        <Fragment>
          <div className="row">
            <div className="col-10">
              <PublishVideoDropdown />
            </div>
          </div>
          <div className="row">
            <div className="col-10">
              <PublishAudioDropdown />
            </div>
          </div>
        </Fragment>}
        <div className="row">
          <div className="col-10">
            { !webrtcPublish.connected &&
              <button id="publish-toggle" type="button" className="btn"
                disabled={publishSettings.publishStarting }
                onClick={(e)=>{
                  
                  setStartingLiveStream(true);

                  fetch('https://api.cloud.wowza.com/api/beta/live_streams/' + publishSettings.channelId + '/start', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'wsc-api-key': wowza.apiKey,
                      'wsc-access-key': wowza.accessKey
                    }
                  })
                  .then(response => response.json())
                  .then(data => {
                    timer = setInterval(()=> {
                      // Get Live Stream State
                      getLiveStreamState(publishSettings.channelId, (data)=> {
                        if(data.live_stream.state == "started") {
                          clearInterval(timer);
                          setStartingLiveStream(false);

                          if(!publishSettings.primaryServer) {
                            dispatch(PublishSettingsActions.startPublish())
                          }else {
                            dispatch({type:WebRTCPublishActions.SET_WEBRTC_PUBLISH_CONNECTED,connected:true});
                            alert("You can now start streaming on OBS");
                          }
                        }       
                      });                      
                    }, 1000);
                  })

                }}
              >{!startingLiveStream? 
                "Start Streaming" : 
                <Fragment><span>Starting...</span><img src="/images/loader.gif" width="100px" /></Fragment>}
                </button>
            }
            
            { webrtcPublish.connected &&
              <button id="publish-toggle" type="button" className="btn"
                onClick={(e)=>{
                  fetch('https://api.cloud.wowza.com/api/beta/live_streams/' + publishSettings.channelId + '/stop', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'wsc-api-key': wowza.apiKey,
                      'wsc-access-key': wowza.accessKey
                    }
                  })
                  .then(response => response.json())
                  .then(data => {
                    if(!publishSettings.primaryServer) {
                      dispatch(PublishSettingsActions.stopPublish());
                    }else {
                      dispatch({type:WebRTCPublishActions.SET_WEBRTC_PUBLISH_CONNECTED,connected:false});
                    }
                  });
                }}
              >Stop Streaming</button>
            }
          </div>
        </div>
      </form>   
  );
}

  export default PublishSettingsForm;
