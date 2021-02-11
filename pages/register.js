import { useState } from 'react'; 
import fire from '../config/fire-config';
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

    setIsLoading(true);

    if (password !== passConf) {
      setNotification('Password and password confirmation does not match')

      setTimeout(() => {
        setNotification('')
      }, 2000)

      setPassword('');
      setPassConf('');
      return null;

    }

    fire.auth()
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
          fire.firestore()
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
        console.log(err.code, err.message)
      });
  }

  return (
    <div>
      <h1>Create new user</h1>

      {notify}
      <form onSubmit={handleLogin}>
        Username: <input type="text" value={userName} onChange={({target}) => setUsername(target.value)} />
        <br />
        Email: <input type="text" value={email} onChange={({target}) => setEmail(target.value)} /> 
        <br />
        Password: <input type="password" value={password} onChange={({target}) => setPassword(target.value)} /> 
        <br />
        Password conf: <input type="password" value={passConf} onChange={({target}) => setPassConf(target.value)} /> 
        <br />
        <button type="submit">Register</button>
        {isLoading && <img src="/loader.gif" width="100px" style={{display:"block"}}/>}
      </form>
    </div>
  )
}

export default Register