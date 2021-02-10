import fire from '../../config/fire-config';
import Link from 'next/link'

const User = (props) => {

  return (
    <div>
      <h2>{props.userName}'s channel</h2>
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
    });
    });

  return {
    props: {
      userName: content.userName,
      password: content.password,
    }
  }
}

export default User