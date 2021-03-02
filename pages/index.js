import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';
import Head from 'next/head';

import fire from '../config/fire-config';


const Home = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const user = useSelector ((state) => state.user);

  useEffect(() => {
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

  return (
    <div className="index container-fluid mt-3">
      <Head>
        <title>VRG 2</title>
      </Head>
      
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
    </div>
  )
}

export default Home;