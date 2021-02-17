import { useState, useEffect } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import CreatePost from '../components/CreatePost';
import Link from 'next/link';

const Home = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {

    // Get logged in state
    fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true);
          setCurrentUser(user);
        } else {
          setLoggedIn(false);
          setCurrentUser({});
        }
      })

    // Get list of users
    fire.firestore()
      .collection('users')
      .onSnapshot(snap => {
        const users = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(users);
      });
  }, []);

  const handleLogout = () => {
    fire.auth()
      .signOut()
      .then(() => {
        setNotification('Logged out')
        setTimeout(() => {
          setNotification('')
        }, 2000)
      });
  }

  return (
    <div>
      <Head>
        <title>VRG</title>
      </Head>
      
      <h1 className="mySuperTitle">VRG</h1>
      <h2>Channels</h2>

      <ul>
        {users.map(user =>
          <li key={user.userName}>
            <Link href="/user/[userName]" as={'/user/' + user.userName }>
              <a itemProp="hello">{user.userName}</a>
            </Link>
          </li>
        )}
      </ul>

      {/*{loggedIn && <CreatePost />}*/}

      {!loggedIn 
      ?
        <div>
          <Link href="/register">
            <a>Register</a>
          </Link> | 
          <Link href="/login">
            <a> Login</a>
          </Link>
        </div>
      :
        <div>
          <button onClick={handleLogout}>Logout</button>
          Hello, <a href="/profile">{!!currentUser && currentUser.displayName}</a>
        </div>
      }
    </div>
  )
}

export default Home;