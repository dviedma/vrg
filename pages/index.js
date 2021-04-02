import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {isPastEvent, isLiveEvent} from '../utils/EventUtils';

import Link from 'next/link';
import Head from 'next/head';

import Slider from "react-slick";

import {firebase} from '../config/fire-config';


const Home = () => {
  const [events, setEvents] = useState([]);
  const slugify = require('@sindresorhus/slugify');
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]    
  };

  useEffect(() => {
    // Get list of users
    firebase.firestore()
      .collection('events')
      .onSnapshot(snap => {
        let events = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        events = events.filter(event => !isPastEvent(event));
        events.sort((a, b) => { return a.startTs - b.startTs })
        setEvents(events);
      });
  }, []);

  return (
    <div className="index">
    <div className="container-fluid mt-3 text-center">
      <Head>
        <title>VRG</title>
      </Head>
      
      <div className="justify-content-sm-center mt-5">
        <h2>Live Breaks</h2>
      </div>
      <div className="justify-content-sm-center mt-5 player-home" >
      <a href="/chigah">
        <img src="/images/chigah.jpg" />
        <h3 className="mt-3">chigah</h3>
        </a>
      </div>
      </div>
      
      <div className="home-slider mt-5 pt-5 pb-4">
        <Slider {...sliderSettings}>
          {events.map((event,i) =>
            <li key={i} className="pr-4 pl-4">
              <Link href="/event/[eventId]/[eventSlu]" as={'/event/' + event.id + '/' + slugify(event.title)}>
                <a>
                  <img src={(event.image)? event.image : "/images/box-placeholder.jpg"} width="100%"/>
                  <h4 className="mt-3">{event.title} <span style={{color:'white'}}>{event.price != undefined && `$${event.price}`}</span></h4>
                </a>
              </Link>
            </li>
          )}
        </Slider>
      </div>
    
    </div>
  )
}

export default Home;