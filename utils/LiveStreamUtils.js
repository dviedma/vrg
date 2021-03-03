import wowza from '../config/wowza-config';

export const getLiveStreamState = (channelId, callback) => {
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
    callback(data); 
  })
}

