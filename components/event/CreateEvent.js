import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';

import fire from '../../config/fire-config';

var { DateTime } = require('luxon');

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00pm');
  const [duration, setDuration] = useState('2');
  const [spots, setSpots] = useState('');
  const [price, setPrice] = useState('');
  const [notification, setNotification] = useState('');

  const user = useSelector ((state) => state.user);

  // return millisecons
  const handleDate = () => {
    let startDt,
        endDt,
        hours;

    hours = time.split(":")[0]; 
    if(time.split(":")[0] == "12") {
      hours = 0;
    }
    if(time.indexOf("pm") >= 0) {
      hours = Number(time.split(":")[0]) + 12;
    }

    try {
      startDt = DateTime.fromObject({
        month: date.split("/")[0], 
        day: date.split("/")[1], 
        year: date.split("/")[2], 
        hour: hours, 
        minute: time.substr(time.indexOf(":")+1, 2), 
        zone: 'America/New_York'
      })
    }catch(e) {
      setNotification("There seems to be an error with the date");
      setTimeout(() => {
        setNotification('')
      }, 5000);
      return null;     
    }

    if(startDt.invalid) {
      setNotification(startDt.invalid.explanation);
      setTimeout(() => {
        setNotification('')
      }, 5000);
      return null;     
    }

    endDt = startDt.plus({hours: duration});

    if(DateTime.now().ts > endDt.ts) {
      setNotification("Start date can't be a past date");
      setTimeout(() => {
        setNotification('')
      }, 5000);      
      return null;
    }

    return [startDt, endDt];
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let startEndDateTime = [];

    startEndDateTime = handleDate();

    if(!startEndDateTime) {
      return;
    }

    fire.firestore()
      .collection('events')
      .add({
        title: title,
        startTs: startEndDateTime[0].ts,
        startDate: startEndDateTime[0].toLocaleString(DateTime.DATETIME_FULL),
        endTs: startEndDateTime[1].ts,
        endDate: startEndDateTime[1].toLocaleString(DateTime.DATETIME_FULL),        
        userName: user.currentUser.displayName,
        userId: user.currentUser.uid,
        spots: Number(spots),
        price: Number(price)
      });

    setNotification('Event scheduled');
    setTimeout(() => {
      setTitle('');
      setDate('');
      setTime('12:00pm');
      setDuration('2'); 
      setSpots('');     
      setPrice('');
      setNotification('')
    }, 5000)
  }
  return (
     <Fragment>
       <h2>Schedule Event</h2>
     
        <form onSubmit={handleSubmit} className="input-group" style={{padding:'1rem', border: '2px solid white'}}>
          <div className="col-sm-12 pl-0 pr-0">
            <label className="form-label">Event Title</label>
            <input className="form-control" type="text" value={title} onChange={({target}) => setTitle(target.value)} />
          </div>
          <div className="col-sm-8 pl-0 pr-0">
            <label className="form-label mt-3">Event Date</label>
          </div>
          <div className="col-sm-4 pr-0">
            <label className="form-label mt-3">Event Duration</label>
          </div>          
          <div className="col-sm-4 pl-0 pr-0">
            <input placeholder="mm/dd/yyyy" className="form-control" type="text" value={date} onChange={({target}) => setDate(target.value)} />
          </div>
          <div className="col-sm-4 pr-0">
            <select className="form-control" aria-label="Default select example" onChange={({target}) => setTime(target.value)}>
              <option selected={time=="12:00am" && "selected"} value="12:00am">12:00am</option>
              <option selected={time=="12:30am" && "selected"} value="12:30am">12:30am</option>
              <option selected={time=="1:00am" && "selected"} value="1:00am">1:00am</option>
              <option selected={time=="1:30am" && "selected"} value="1:30am">1:30am</option>
              <option selected={time=="2:00am" && "selected"} value="2:00am">2:00am</option>
              <option selected={time=="2:30am" && "selected"} value="2:30am">2:30am</option>
              <option selected={time=="3:00am" && "selected"} value="3:00am">3:00am</option>
              <option selected={time=="3:30am" && "selected"} value="3:30am">3:30am</option>
              <option selected={time=="4:00am" && "selected"} value="4:00am">4:00am</option>
              <option selected={time=="4:30am" && "selected"} value="4:30am">4:30am</option>
              <option selected={time=="5:00am" && "selected"} value="5:00am">5:00am</option>
              <option selected={time=="5:30am" && "selected"} value="5:30am">5:30am</option>
              <option selected={time=="6:00am" && "selected"} value="6:00am">6:00am</option>
              <option selected={time=="6:30am" && "selected"} value="6:30am">6:30am</option>
              <option selected={time=="7:00am" && "selected"} value="7:00am">7:00am</option>
              <option selected={time=="7:30am" && "selected"} value="7:30am">7:30am</option>
              <option selected={time=="8:00am" && "selected"} value="8:00am">8:00am</option>
              <option selected={time=="8:30am" && "selected"} value="8:30am">8:30am</option>
              <option selected={time=="9:00am" && "selected"} value="9:00am">9:00am</option>
              <option selected={time=="9:30am" && "selected"} value="9:30am">9:30am</option>
              <option selected={time=="10:00am" && "selected"} value="10:00am">10:00am</option>
              <option selected={time=="10:30am" && "selected"} value="10:30am">10:30am</option>
              <option selected={time=="11:00am" && "selected"} value="11:00am">11:00am</option>
              <option selected={time=="11:30am" && "selected"} value="11:30am">11:30am</option>
              <option selected={time=="12:00pm" && "selected"} value="12:00pm">12:00pm</option>
              <option selected={time=="12:30pm" && "selected"} value="12:30pm">12:30pm</option>
              <option selected={time=="1:00pm" && "selected"} value="1:00pm">1:00pm</option>
              <option selected={time=="1:30pm" && "selected"} value="1:30pm">1:30pm</option>
              <option selected={time=="2:00pm" && "selected"} value="2:00pm">2:00pm</option>
              <option selected={time=="2:30pm" && "selected"} value="2:30pm">2:30pm</option>
              <option selected={time=="3:00pm" && "selected"} value="3:00pm">3:00pm</option>
              <option selected={time=="3:30pm" && "selected"} value="3:30pm">3:30pm</option>
              <option selected={time=="4:00pm" && "selected"} value="4:00pm">4:00pm</option>
              <option selected={time=="4:30pm" && "selected"} value="4:30pm">4:30pm</option>
              <option selected={time=="5:00pm" && "selected"} value="5:00pm">5:00pm</option>
              <option selected={time=="5:30pm" && "selected"} value="5:30pm">5:30pm</option>
              <option selected={time=="6:00pm" && "selected"} value="6:00pm">6:00pm</option>
              <option selected={time=="6:30pm" && "selected"} value="6:30pm">6:30pm</option>
              <option selected={time=="7:00pm" && "selected"} value="7:00pm">7:00pm</option>
              <option selected={time=="7:30pm" && "selected"} value="7:30pm">7:30pm</option>
              <option selected={time=="8:00pm" && "selected"} value="8:00pm">8:00pm</option>
              <option selected={time=="8:30pm" && "selected"} value="8:30pm">8:30pm</option>
              <option selected={time=="9:00pm" && "selected"} value="9:00pm">9:00pm</option>
              <option selected={time=="9:30pm" && "selected"} value="9:30pm">9:30pm</option>
              <option selected={time=="10:00pm" && "selected"} value="10:00pm">10:00pm</option>
              <option selected={time=="10:30pm" && "selected"} value="10:30pm">10:30pm</option>
              <option selected={time=="11:00pm" && "selected"} value="11:00pm">11:00pm</option>
              <option selected={time=="11:30pm" && "selected"} value="11:30pm">11:30pm</option>                 
            </select> 
          </div>    
          <div className="col-sm-4 pr-0">
            <select className="form-control" aria-label="Default select example" onChange={({target}) => setDuration(target.value)}>
              <option selected={duration==1 && "selected"} value="1">1 hour</option>
              <option selected={duration==2 && "selected"} value="2">2 hour</option>
              <option selected={duration==3 && "selected"} value="3">3 hour</option>
              <option selected={duration==4 && "selected"} value="4">4 hour</option>
              <option selected={duration==5 && "selected"} value="5">5 hour</option>
            </select>                   
          </div>    
          <div className="col-sm-4 pl-0 pr-0">
            <label className="form-label mt-3">Spots</label>
            <input className="form-control" type="number" value={spots} onChange={({target}) => setSpots(target.value)} />
          </div>    
          <div className="col-sm-4 pr-0">
            <label className="form-label mt-3">Price per ticket ($)</label>
            <input className="form-control" type="number" value={price} onChange={({target}) => setPrice(target.value)} />
          </div>              
          <div className="col-sm-12 pl-0 pr-0 mb-3">
            <button type="submit" className="btn mt-3">Save</button>
          </div>                
          <p style={{display:'block'}}>{notification}</p>
        </form>
        </Fragment>

  )
}

export default CreateEvent;