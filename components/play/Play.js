import React from 'react';
import { useDispatch } from 'react-redux';

import Player from './Player';
import PlaySettingsForm from './PlaySettingsForm';

const Play = (props) => {
  return (
    <div className="container-fluid mt-3" id="play-content">
      <div className="row pr-3">
        <div className="col-md-8 col-sm-12">
          <div id="play-video-container" style={{height: 0,width: "100%",paddingBottom: "57%",backgroundColor: "rgba(102, 102, 102, 1)",borderRadius: "0.75em"}}>
            <Player />
          </div>
        </div>
        <PlaySettingsForm />
      </div>
    </div>
  );
}

export default Play;