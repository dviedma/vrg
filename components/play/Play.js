import React from 'react';
import { useDispatch } from 'react-redux';

import Player from './Player';
import Chat from '../chat/Chat';
import PlaySettingsForm from './PlaySettingsForm';

const Play = (props) => {
  return (
    <div id="play-content">
      <div className="row pr-3">
        <div className="col-md-8 col-sm-12">
          <div id="play-video-container" style={{height: 0,width: "100%",paddingBottom: "57%",backgroundColor: "rgba(102, 102, 102, 1)",borderRadius: "0.75em"}}>
            {/*          <div id="play-video-container" 
            style={{height: 0,width: "100%",paddingBottom: "57%",background: "url(https://media3.giphy.com/media/etUdXnsEMrBng0vOvY/200.gif) no-repeat",
            borderRadius: "0.75em",backgroundSize:"110%",backgroundPosition:"-10px" }}> */}
            <Player />
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <Chat/>
          <PlaySettingsForm />
        </div>        
      </div>
    </div>
  );
}

export default Play;