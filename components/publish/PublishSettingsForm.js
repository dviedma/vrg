import { useState, useEffect } from 'react';
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
      {startingLiveStream && <img src="/loader.gif" width="100px" style={{display:"block"}}/>}
      <form id="publish-settings-form">
        
        {/*
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <div className="form-group">
              <label htmlFor="audioBitrate">Audio Bitrate</label>
              <div className="input-group">
                <input type="number"
                  className="form-control"
                  id="audioBitrate"
                  name="audioBitrate"
                  value={publishSettings.audioBitrate}
                  onChange={(e)=>dispatch({type:PublishSettingsActions.SET_PUBLISH_AUDIO_BITRATE,audioBitrate:e.target.value})}
                  />
                <div className="input-group-append">
                  <span className="input-group-text">Kbps</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12">
            <div className="form-group">
              <label htmlFor="audioCodec">Audio Codec</label>
              <div className="input-group">
                <select className="form-control" id="audioCodec" name="audioCodec" value="opus" readOnly>
                  <option value="opus">Opus</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <div className="form-group">
              <label htmlFor="videoBitrate">Video Bitrate</label>
              <div className="input-group">
                <input type="number"
                  className="form-control"
                  id="videoBitrate"
                  name="videoBitrate"
                  value={publishSettings.videoBitrate}
                  onChange={(e)=>dispatch({type:PublishSettingsActions.SET_PUBLISH_VIDEO_BITRATE,videoBitrate:e.target.value})}
                />
                <div className="input-group-append">
                  <span className="input-group-text">Kbps</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12">
            <div className="form-group">
              <label htmlFor="videoCodec">Video Codec</label>
              <div className="input-group">
                <select className="form-control"
                  id="videoCodec"
                  name="videoCodec"
                  value={publishSettings.videoCodec}
                  onChange={(e)=>dispatch({type:PublishSettingsActions.SET_PUBLISH_VIDEO_CODEC,videoCodec:e.target.value})}
                >
                  { PublishOptions.videoCodecs.map((codec,key) => {
                    return <option key={key} value={codec.value}>{codec.name}</option>
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        */}

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
              >Start Streaming</button>
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
              >Stop</button>
            }
          </div>
        </div>
      </form>
    </div>
  );
}

  export default PublishSettingsForm;
