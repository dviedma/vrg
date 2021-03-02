import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as PublishSettingsActions from '../../actions/publishSettingsActions';
import * as PublishOptions from '../../constants/PublishOptions';
import PublishAudioDropdown from './PublishAudioDropdown';
import PublishVideoDropdown from './PublishVideoDropdown';

import wowza from '../../config/wowza-config';

const PublishSettingsForm = () => {

  const dispatch = useDispatch();
  const [startingLiveStream, setStartingLiveStream] = useState(false);
  const publishSettings = useSelector ((state) => state.publishSettings);
  const webrtcPublish = useSelector ((state) => state.webrtcPublish);
  let timer;

  //TODO: refactor in unified function
  const getLiveStreamState = (channelId, callback) => {
    console.log(">>> fetch getLiveStreamState")
    fetch('https://api.cloud.wowza.com/api/beta/live_streams/' + channelId + '/state', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'wsc-api-key': wowza.apiKey,
        'wsc-access-key': wowza.accessKey
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(">>> DATA getLiveStreamState", data)
      if(data.live_stream.state == "started") {
        console.log(">>> STARTED!!");
        clearInterval(timer);
        setStartingLiveStream(false);
        dispatch(PublishSettingsActions.startPublish())
      }    
    })
  }

  return (
    <div className="col-md-4 col-sm-12" id="publish-settings">
      <form id="publish-settings-form">
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
                    console.log("DATA", data)

                    timer = setInterval(()=> {
                      getLiveStreamState(publishSettings.channelId);
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
                  dispatch(PublishSettingsActions.stopPublish());
                  fetch('https://api.cloud.wowza.com/api/beta/live_streams/' + publishSettings.channelId + '/stop', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'wsc-api-key': wowza.apiKey,
                      'wsc-access-key': wowza.accessKey
                    }
                  })
                }}
              >Stop Streaming</button>
            }
          </div>
        </div>
      </form>
    </div>
  );
}

  export default PublishSettingsForm;
