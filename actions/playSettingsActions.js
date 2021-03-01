export const SET_PLAY_SIGNALING_URL='SET_PLAY_SIGNALING_URL';
export const SET_PLAY_APPLICATION_NAME='SET_PLAY_APPLICATION_NAME';
export const SET_PLAY_STREAM_NAME='SET_PLAY_STREAM_NAME';
export const SET_PLAY_FLAGS='SET_PLAY_FLAGS';

export const startPlay = (channelId) => {
  return {
    type: SET_PLAY_FLAGS,
    playStart: true,
    channelId: channelId
  }
}

export const stopPlay = (channelId) => {
  return {
    type: SET_PLAY_FLAGS,
    playStop: true, 
    channelId: channelId
  }
}