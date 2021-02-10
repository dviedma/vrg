import fire from '../config/fire-config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'

const Profile = (props) => {

  const [currentUser, setCurrentUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Get logged in state
    fire.auth()
      .onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          setCurrentUser(user);
        } else {
          router.push("/login")
        }
      })
    });

  return (
    <div>
      <h1>Hi, {currentUser.displayName}</h1>
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
    )
}

export default Profile;