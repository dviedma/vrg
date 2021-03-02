import { useState, useEffect, Fragment } from 'react';
import fire from '../../config/fire-config';

import Link from 'next/link';

var { DateTime } = require('luxon');

const ListEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Get list of events
    fire.firestore()
      .collection('events')
      .onSnapshot(snap => {
        const events = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        events.sort((a, b) => { return a.date - b.date })
        setEvents(events);
      });
  }, []);

  return (
    <Fragment>
    <h2>Upcoming Events Event</h2>
      <ul>
        {events.map(event =>
          <li key={event.uid}>
            <Link href="/user/[userName]" as={'/user/' }>
              <a>{event.title} on {DateTime.fromMillis(event.date).toLocaleString(DateTime.DATETIME_FULL)}</a>
            </Link>
          </li>
        )}
      </ul>
      </Fragment>
  )
}

export default ListEvents;