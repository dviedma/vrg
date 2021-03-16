import { useState } from 'react'; 
import {firebase} from '../config/fire-config';
import wowza from '../config/wowza-config';
import { useRouter } from 'next/router'

const Register = () => {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [notify, setNotification] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (password !== passConf) {
      setNotification('Password and password confirmation does not match')

      setTimeout(() => {
        setNotification('')
      }, 3000)

      setPassword('');
      setPassConf('');
      return null;
    }

    setIsLoading(true);

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in

        // Update user's displayName
        userCredential.user.updateProfile({
          displayName: userName
        })

        // Create Wowza channel
        wowza.baseChannelConfig.live_stream.name = "webRTC_" + userName;
        fetch('https://api.cloud.wowza.com/api/beta/live_streams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'wsc-api-key': wowza.apiKey,
            'wsc-access-key': wowza.accessKey
          },
          body: JSON.stringify(wowza.baseChannelConfig),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success Creating Wowza Channel:', data);

          // Add user to Users collection 
          firebase.firestore()
            .collection('users')
            .add({
              userName: userName,
              email: email,
              password: password,
              wowza: {
                channelId: data.live_stream.id,
                applicationName: data.live_stream.source_connection_information.application_name,
                sdpUrl: data.live_stream.source_connection_information.sdp_url,
                streamName: data.live_stream.source_connection_information.stream_name
              }
            })
            .then(function() {
              // Update successful
              setIsLoading(false);
              router.push("/");
            });

          })
        .catch((error) => {
          console.error('Error:', error);
        });
      })
      .catch((err) => {
        setNotification(err.message);
        setIsLoading(false);

        setTimeout(() => {
          setNotification('')
        }, 3000)
      });
  }

  return (
    <div className="login container-fluid mt-5">
      <div className="row justify-content-sm-center">
        <div className="col col-sm-5 input-group">
          <h1>Join the family!</h1>
          <form onSubmit={handleLogin}>
            <label className="form-label">Username</label>
            <input className="form-control" type="text" value={userName} onChange={({target}) => setUsername(target.value)} />
            <label className="form-label mt-3">Email</label>
            <input className="form-control" type="text" value={email} onChange={({target}) => setEmail(target.value)} /> 
            <label className="form-label mt-3">Password</label>
            <input className="form-control" type="password" value={password} onChange={({target}) => setPassword(target.value)} /> 
            <label className="form-label mt-3">Password Confirmation</label>
            <input className="form-control" type="password" value={passConf} onChange={({target}) => setPassConf(target.value)} /> 
            <button className="btn mt-3" type="submit">Register</button>
            {isLoading && <img src="/images/loader.gif" width="100px" style={{display:"block"}}/>}
          </form>
          <p className="login-message mt-3">{notify}</p>
        </div>
      </div>
    </div>
  )
}

export default Register