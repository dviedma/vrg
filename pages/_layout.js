import { Provider, useDispatch } from "react-redux";
import { useEffect } from 'react';
import Head from 'next/head'
import store from '../store'
import Nav from '../components/shell/Nav';
import Errors from '../components/shell/Errors';
import fire from '../config/fire-config';

import * as UserActions from '../actions/userActions';

export default function Layout({ Component, pageProps }) {

  const dispatch = useDispatch();

  useEffect(() => {
    // Get logged in state
    fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          dispatch ({type:UserActions.SET_USER_LOGGED_IN, currentUser:user});
        } else {
          dispatch ({type:UserActions.SET_USER_LOGGED_OUT});
        }
      })
  });

  return (
    
    <div>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
      </Head>
      <Nav />
      <Errors />
      <Component {...pageProps} />
    </div>
  )
}