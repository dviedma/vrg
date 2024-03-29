
import { combineReducers } from 'redux';
import errors from './errorsReducer';
import media from './mediaReducer';
import compositeSettings from './compositeSettingsReducer';
import playSettings from './playSettingsReducer';
import publishSettings from './publishSettingsReducer';
import webrtcPublish from './webrtcPublishReducer';
import webrtcPlay from './webrtcPlayReducer';
import webrtcMeeting from './webrtcMeetingReducer';
import user from './userReducer';
import live from './liveReducer';

const rootReducer = combineReducers({
  errors,
  media,
  compositeSettings,
  playSettings,
  publishSettings,
  webrtcPublish,
  webrtcPlay,
  webrtcMeeting,
  user,
  live
})

export default rootReducer;
