import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { PayPalButton } from "react-paypal-button-v2";

import {firebase} from '../config/fire-config';
import {getLiveStreamState} from '../utils/LiveStreamUtils';
import {isChannelLive} from '../utils/EventUtils';

import Player from '../components/play/Player';
import Chat from '../components/chat/Chat';
import * as PlaySettingsActions from '../actions/playSettingsActions';
import * as ErrorsActions from '../actions/errorsActions';

var { DateTime } = require('luxon');

const User = (props) => {
  const dispatch = useDispatch();
  const live = useSelector ((state) => state.live);

  const todayDate = DateTime.now().toLocaleString(DateTime.DATE_SHORT).replace(/\//g, "");

  const [isChatActive, setChatActive] = useState(false);
  const [isPaypalActive, setPaypalActive] = useState(false);
  const [channelLive, setChannelLive] = useState(false);
  const [isWowzaLive, setWowzaLive] = useState(false);
  const [payments, setPayments] = useState([]);

  const [amount, setAmount] = useState(10);
  const user = useSelector ((state) => state.user);

  dispatch({type:PlaySettingsActions.SET_PLAY_SIGNALING_URL,signalingURL: props.wowza.sdpUrl});
  dispatch({type:PlaySettingsActions.SET_PLAY_APPLICATION_NAME,applicationName: props.wowza.applicationName});
  dispatch({type:PlaySettingsActions.SET_PLAY_STREAM_NAME,streamName: props.wowza.streamName});

  /**
   * 
   * useEffect()
   */
  useEffect(() => {
    isChannelLive(props.userName, (event)=> {
      setChannelLive(event);
    })

    //console.log(">>> LIVE", live);
    for (const channel in live) {
      if(channel == props.wowza.channelId && live[channel].live) {
        //console.log("SET WOWZA LIVEE");
        //setWowzaLive(true);
      }
    }

    // Get Live Stream State
    getLiveStreamState(props.wowza.channelId, (data)=> {
      if(data.live_stream.state == "started") {        
        setTimeout(()=> {
          //console.log("START PLAY!");
          dispatch(PlaySettingsActions.startPlay());
        }, 5000)        
      }        
    });
  }, []);

  useEffect(() => {
    let _payments;

    //Payments log
    firebase.firestore()
      .collection('payments')
      .where("eventId", "==", channelLive? channelLive.id : "")
      .onSnapshot(querySnapshot => {
        _payments = [];
        querySnapshot.forEach((doc) => {
          _payments.push(doc.data());
        });
        _payments.sort((a, b) => { return b.timestamp - a.timestamp })
        setPayments(_payments);
      });
  }, []);

  /** 
   * 
   * Chat
  */
  const handleChatClick = (e) => {
    const target = e.target;
    console.log(target.getAttribute("id"));

    if(target.getAttribute("id") && target.getAttribute("id") != "chat-input") {
      setChatActive(!isChatActive);
    }    
  }

  /** 
   * 
   * Paypal
   */

  return (
    <Fragment>
    <Head>
      <title>{'VRG | ' + props.userName}</title>
      <script id='player_embed' src='https://player.cloud.wowza.com/hosted/bp9vlp36/wowza.js' type='text/javascript'></script>
    </Head>    
    <div className="container-fluid mt-3" id="play-content">
      <div className="row" style={{height:'calc(100vh - 70px)'}}>         
        <div className="col-md-7 play-video-container-wrapper">
          <div id="play-video-container" style={{height: 0,width: "100%",paddingBottom: "56%",backgroundColor: "rgba(102, 102, 102, 1)"}}>
            <Player channelId={props.wowza.channelId}/>
            <div id='wowza_player' style={{display: props.rtmp? 'block':'none'}}></div>
          </div>
          <div className="user-info mt-3">
            <h1>{props.userName} {channelLive && ("LIVE " + channelLive.title)}</h1>
            <p style={{marginBottom:'0.5rem'}}>{props.about}</p>
            <ul>
              {
                ["website", "youtube", "instagram", "twitter"].map((item, i) => {
                  if(props[item] != ""){
                    let link = item;
                    link = props[item].substring(0, 4) == "http"? link : "http://" + props[item];
                    return(<li><span style={{textTransform:'capitalize'}}>{item}:</span> <a target="_blank" href={link}>{props[item]}</a></li>)
                  }
                })
              }
            </ul>
          </div>     
        </div>
        <div className={`col-md-3 col-11 pl-0 ${isChatActive ? "chat-active" : ""}`} id="chat-container" onClick={(e) => handleChatClick(e)}>
          <Chat userName={props.userName} chatId={props.eventId}/>        
        </div> 
        <div className={`col-md-2 col-11 pl-0 ${isPaypalActive ? "paypal-active" : ""}`} id="paypal-container" onClick={() => setPaypalActive(!isPaypalActive)}>
          <div className="user-payment">
            {props.paypalMerchantId? 
              <Fragment>
                <p style={{fontWeight:'bold'}} className="mt-2 mb-0">Pay {props.userName}</p>
                <div className="paypal">
                  {/*<div className="paypal-amount-wrapper"><div className="paypal-amount-minus">-</div></div>*/}
                  <div className="paypal-dollar-sign">$</div><input onChange={({target}) => setAmount(target.value)} type="text" value={amount} id="paypal-amount"/>
                  {/*<div className="paypal-amount-wrapper"><div className="paypal-amount-plus">+</div></div>*/}
                </div>                
                <PayPalButton
                  amount={amount}
                  onSuccess={(details, data) => {
                    console.log(">>> details", details);


                    confetti.start();
                    //dispatch({type:ErrorsActions.SET_ERROR_MESSAGE,message:`${details.payer.name.given_name} ${details.payer.name.surname} paid $${details.purchase_units[0].amount.value}`});
                    var audio = new Audio('/sounds/applause.wav');
                    audio.play();

                    try {
                      firebase.firestore()
                      .collection('payments')
                      .add({
                        payerEmail: details.payer.email_address,
                        payerFullName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                        amount: details.purchase_units[0].amount.value,
                        timestamp: Date.now(),
                        time: DateTime.now().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
                        eventId: channelLive.id 
                      });
                    } catch (error) {
                      console.log(error);
                    }

                    
                    setTimeout(()=> {
                      confetti.stop();
                    }, 2000);
                    setTimeout(()=> {
                      dispatch({type:ErrorsActions.HIDE_ERROR_PANEL});
                    }, 10000);
                  }}
                  options={{
                    clientId: "AXVZRyzf_0rFCSBmHoDWt7JL0KyWqPRigGlJVegtG03sbZlQKEbuSyx5v_K5Bz9hcBpkw7jVtKZM6Bij",
                    merchantId: props.paypalMerchantId
                  }}
                  style={{ color: "blue", shape: "pill", label: "pay", height: 25 }}
                />
                
                </Fragment>
            : ""
            }   
          </div>  

          {
            (
              props.userName == user.currentUser.displayName &&           
              <div className="user-payment payment-log mt-3">
                <p style={{fontWeight:'bold'}} className="mt-2 mb-0">Payments Log</p>
                <ul>
                {payments.map((payment, i) => {
                    return <li key={i}>
                      <p>{payment.time}: <span style={{fontWeight:'bold'}}>{payment.payerFullName}</span> paid <span style={{fontWeight:'bold'}}>${payment.amount}</span></p>
                    </li>
                  })}
                </ul>
              </div> 
            )
          }               
        </div>           
       
      </div>
    </div>
    </Fragment>
  )
}

/*
export async function getStaticPaths() {
  return {
    paths: [
      { params: { userName: 'elviajeropolar' } }
    ],
    fallback: false
  };
}
*/

export const getServerSideProps = async ({ params }) => {
  let content = {}
  
  await firebase.firestore()
    .collection('users').where("userName", "==", params.userName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        /*
        content['userName'] = doc.data().userName;  //TODO use user's displayName
        content['userId'] = doc.id;  //TODO use user's displayName
        content['wowza'] = doc.data().wowza;
        content['rtmp'] = doc.data().rtmp? doc.data().rtmp : "";
        content['paypalMerchantId'] = doc.data().paypalMerchantId? doc.data().paypalMerchantId : "";
        */
        content = doc.data();
        content['userId'] = doc.id;
      });
    });

  return {
    /*
    props: {
      userName: content.userName,
      userId: content.userId,
      wowza: content.wowza,
      paypalMerchantId: content.paypalMerchantId,
      rtmp: content.rtmp,
      eventId: params.userName[1]? params.userName[1] : 0     //DV: not in use  
    }
    */
   props: content
  }
}

export default User