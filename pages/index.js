import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';
import Head from 'next/head';

import fire from '../config/fire-config';


const Home = () => {
  const [users, setUsers] = useState([]);

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
            <Link href="/[userName]" as={'/' + user.userName }>
              <a>{user.userName}</a>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Home;