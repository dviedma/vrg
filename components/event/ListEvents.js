import { useState, useEffect, Fragment } from 'react';
import fire from '../../config/fire-config';
import {isPastEvent, isLiveEvent} from '../../utils/EventUtils';

import Link from 'next/link';

var { DateTime } = require('luxon');

const ListEvents = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Get list of events
    fire.firestore()
      .collection('events').where("userName", "==", props.userName)
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
    <Fragment>
    <h2>Upcoming Events</h2>
      <ul>
        {events.map(event =>
          <li key={event.uid} className={(isPastEvent(event)? "past-event" : "")}>
            <Link href="/user/[userName]/[eventId]" as={'/user/'+ props.userName + '/' +event.id}>
              <a>{event.title} on {event.startDate}</a>
            </Link>
            {isLiveEvent(event) && " LIVE"}
          </li>
        )}
      </ul>
      </Fragment>
  )
}

export default ListEvents;