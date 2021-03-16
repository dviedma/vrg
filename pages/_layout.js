import { useDispatch } from "react-redux";
import { Fragment, useEffect } from 'react';
import Head from 'next/head'
import Nav from '../components/shell/Nav';
import Footer from '../components/shell/Footer';
import Errors from '../components/shell/Errors';
import fire from '../config/fire-config';

import * as UserActions from '../actions/userActions';
import * as LiveActions from '../actions/liveActions';

export default function Layout({ Component, pageProps }) {

  const dispatch = useDispatch();
  const analytics = firebase.analytics();

  useEffect(() => {
    firebase.analytics().logEvent('>>> Initializing analytics');
    
    // Get logged in state
    fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          dispatch ({type:UserActions.SET_USER_LOGGED_IN, currentUser:user});
        } else {
          dispatch ({type:UserActions.SET_USER_LOGGED_OUT});
        }
      })

    // Get live updates from Wowza
    fire.firestore()
      .collection('wowzaevents')
      .orderBy("timestamp", "desc")
      .limit(1)      
      .onSnapshot(snap => {
        console.log(">>>> wowzaevents changed");
        snap.forEach(function(doc) {
          if(doc.data().event == "video.started") {
            console.log("START!")
            dispatch ({type:LiveActions.SET_USER_LIVE_ON, channelId:doc.data().channelId});
          }else {
            console.log("END!")
            dispatch ({type:LiveActions.SET_USER_LIVE_OFF, channelId:doc.data().channelId});
          }
        });
      });      
  });

  return (
    
    <Fragment>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/gh/mathusummut/confetti.js/confetti.min.js"></script>
      </Head>
      <Nav />
      <Errors />
      {Component && <Component {...pageProps} />}
      <Footer/>
    </Fragment>
  )
}