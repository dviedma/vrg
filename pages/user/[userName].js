import fire from '../../config/fire-config';
import Link from 'next/link'
import Iframe from 'react-iframe'

const User = (props) => {
  return (
    <div>
      <h2>{props.userName}'s channel</h2>
      <Iframe url="http://www.youtube.com/embed/xDMP3i36naA"
        width="400px"
        height="300px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"/>
      <br/>
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const content = {}

  await fire.firestore()
    .collection('users').where("userName", "==", query.userName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        content['userName'] = doc.data().userName;
        content['password'] = doc.data().password;
        content['channelId'] = doc.data().wowza.channelId;
      });
    });

  return {
    props: {
      userName: content.userName,
      password: content.password,
      channelId: content.channelId
    }
  }
}

export default User