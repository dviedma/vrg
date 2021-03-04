import * as LiveActions from '../actions/liveActions';

const initialState = {
  liveUsers: []
}

const liveReducer = (state = initialState, action) => {
  let liveState = { ...state };
  switch (action.type) {
    case LiveActions.SET_USER_LIVE_ON:
      if(!liveState[action.channelId]) {
        liveState[action.channelId] = {};
      } 
      liveState[action.channelId].live = true; 
      return liveState;  
    case LiveActions.SET_USER_LIVE_OFF:
      liveState[action.channelId].live = false;   
      return liveState;
    default:
      return state
  }
}

export default liveReducer;
