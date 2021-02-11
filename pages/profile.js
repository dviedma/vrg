import fire from '../config/fire-config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import publish from '../lib/_publish'
import Head from 'next/head'

const Profile = (props) => {

  const [currentUser, setCurrentUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Get logged in state
    fire.auth()
      .onAuthStateChanged((user) => {
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

//export default Profile;

//export default User
export default () => (
  <div>
    <Head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs=" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.js" integrity="sha256-P8jY+MCe6X2cjNSmF4rQvZIanL5VwUUT4MBnOMncjRU=" crossorigin="anonymous"></script>
      <script type="text/javascript" src="https://webrtchacks.github.io/adapter/adapter-latest.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </Head>
    <Profile />
  </div>
)