import { useState, useEffect, Fragment } from 'react';
import {firebase} from '../../config/fire-config';
import {isPastEvent, isLiveEvent} from '../../utils/EventUtils';

import Link from 'next/link';

var { DateTime } = require('luxon');

const ListEvents = (props) => {
  const [events, setEvents] = useState([]);
  const slugify = require('@sindresorhus/slugify');

  useEffect(() => {
    // Get list of events 
    firebase.firestore()
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
    <div className="list-events">
      <h2 className="test">Upcoming Events</h2>
      <ul>
        {events.map((event,i) =>
          <li key={i} className={(isPastEvent(event)? "past-event" : "")}>
            <Link href="/event/[eventId]/[eventSlu]" as={'/event/' + event.id + '/' + slugify(event.title)}>
              <a>{event.title} on {event.startDate}</a>
            </Link>
            {isLiveEvent(event) && " LIVE"} 
          </li>
        )}
      </ul>
    </div>
  )
}

export default ListEvents;