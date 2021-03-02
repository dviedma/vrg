import { useState, Fragment } from 'react';
import fire from '../../config/fire-config';

var { DateTime } = require('luxon');

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [amPM, setAmPm] = useState('AM');
  const [notification, setNotification] = useState('');


  // return millisecons
  const handleDate = () => {
    let dt;

    try {
      dt = DateTime.fromObject({
        month: date.split("/")[0], 
        day: date.split("/")[1], 
        year: date.split("/")[2], 
        hour: (amPM == "PM")? Number(time.split(":")[0]) + 12 : time.split(":")[0], 
        minute: time.split(":")[1], 
        zone: 'America/New_York'
      })
    }catch(e) {
      console.log(e);
      setNotification("There seems to be an error with the date");
      setTimeout(() => {
        setNotification('')
      }, 5000);
      return null;     
    }

    if(dt.invalid) {
      setNotification(dt.invalid.explanation);
      setTimeout(() => {
        setNotification('')
      }, 5000);
      return null;     
    }

    console.log(dt.ts);

    return dt.ts;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let dateTime = "";

    dateTime = handleDate();

    if(!dateTime) {
      return;
    }

    fire.firestore()
      .collection('events')
      .add({
        title: title,
        date: dateTime,
      });

    setNotification('Event scheduled');
    setTimeout(() => {
      setTitle('');
      setDate('');
      setTime('');
      setAmPm('AM');      
      setNotification('')
    }, 5000)
  }
  return (
     <Fragment>
       <h2>Schedule Event</h2>
     
        <form onSubmit={handleSubmit} className="input-group">
          <div className="col-sm-12 pl-0 pr-0">
            <label className="form-label">Event Title</label>
            <input className="form-control" type="text" value={title} onChange={({target}) => setTitle(target.value)} />
            <label class="form-label mt-3">Event Date</label>
          </div>
          <div className="col-sm-5 pl-0">
            <input placeholder="mm/dd/yyyy" className="form-control" type="text" value={date} onChange={({target}) => setDate(target.value)} />
          </div>
          <div className="col-sm-5 pr-0">
            <input placeholder="hh:mm" className="form-control" type="text" value={time} onChange={({target}) => setTime(target.value)} />
          </div>    
          <div className="col-sm-2 pr-0">
            <select class="form-control" aria-label="Default select example" onChange={({target}) => setAmPm(target.value)}>
              <option selected={amPM=="AM" && "selected"} value="AM">AM</option>
              <option selected={amPM=="PM" && "selected"} value="PM">PM</option>
              
            </select>            
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