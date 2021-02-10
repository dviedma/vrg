import fire from '../config/fire-config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

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

  return (<span>HOLA {currentUser.displayName}</span>)
}

export default Profile;