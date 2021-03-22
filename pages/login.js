import { useState } from 'react';
import {firebase} from '../config/fire-config';
import { useRouter } from 'next/router'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    firebase.auth()
      .signInWithEmailAndPassword(username, password)
      .then((result) => {
        setUsername('')
        setPassword('')
        router.push("/profile")
      })
      .catch((err) => {

        console.log(err.code, err.message)
        setNotification(err.message)

        setTimeout(() => {
          setNotification('')
        }, 3000) 
      })
  }

  const handleOnClick = () => {
    if(!username) {
      setNotification('Please fill up your email');
      setTimeout(() => {
        setNotification('');
      }, 3000);
      return;    
    }

    firebase
      .auth()
      .sendPasswordResetEmail(username)
      .then((link) => {
        setNotification('Success sending reset password email. Look in your inbox!')

        setTimeout(() => {
          setNotification('')
        }, 3000)        
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="login container-fluid mt-5">
      <div className="row justify-content-sm-center">
        <div class="col col-sm-5 input-group">
          <h1>Welcome back</h1>
          <form onSubmit={handleLogin}>
            <label className="form-label">Email</label>
            <input className="form-control" type="text" value={username} onChange={({target}) => setUsername(target.value)} />
            <label className="form-label mt-3">Password</label>
            <input className="form-control" type="password" value={password} onChange={({target}) => setPassword(target.value)} />
            <button type="submit" className="btn mt-3">Login</button>
            <a className="ml-3 " href="#" onClick={handleOnClick}>Forgot Password?</a>
          </form>
          <p className="login-message mt-3">{notify}</p>
        </div>
      </div>
    </div>
  )

}

export default Login
