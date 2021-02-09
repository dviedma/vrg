import fire from '../../config/fire-config';
import Link from 'next/link'

const User = (props) => {

  return (
    <div>
      <h2>{props.userName}</h2>
      <p>
        {props.password}
      </p>
      <Link href="/">
        <a>Back</a>
      </Link>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const content = {}
  await fire.firestore()
    .collection('users')
    .doc(query.id)
    .get()
    .then(result => {
      content['userName'] = result.data().userName;
      content['password'] = result.data().password;
    });

  return {
    props: {
      userName: content.userName,
      password: content.password,
    }
  }
}

export default User