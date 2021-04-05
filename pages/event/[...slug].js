import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";

import {firebase} from '../../config/fire-config';

var { DateTime } = require('luxon');

const Event = (props) => {
  let [spots, setSpots] = useState(props.spots);
  let [reservedSpots, setReservedSpots] = useState(0);
  let [quantity, setQuantity] = useState(0);
  let image = (props.image)? props.image : "/images/box-placeholder.jpg";

  useEffect(() => {
    firebase.firestore()
      .collection('events')
      .doc(props.id)
      .onSnapshot((doc) => {
        setQuantity(0);
        setReservedSpots(doc.data().reservedSpots);
        setSpots(doc.data().spots);
      });    
  },[reservedSpots, spots]);

  const handleQuantityChange = (value) => {
    console.log(value, spots, reservedSpots);
    if(value <= spots - reservedSpots) {
      setQuantity(value);
    }
  }

  const updateReservedSpots = (delta) => {
    const increment = firebase.firestore.FieldValue.increment(delta);

    firebase.firestore()
      .collection('events')
      .doc(props.id)
      .update({ reservedSpots: increment }); 
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-sm-center">
        <div className="col-sm-7">
          <img src={image} width="100%"/>
        </div>
        <div className="col-sm-5">
          <h1 className="d-block">{props.title}</h1>
          <h2 className="mt-3 d-block">${props.price}</h2>
          <p className="mt-3 pb-3 mb-3 d-block">{props.startDate}</p>
          <p className="mt-3 pb-3 mb-3 d-block" style={{borderBottom:'1px solid rgba(255,255,255,0.5)'}}>
            {spots} spots available 
            {reservedSpots > 0 && ` (${reservedSpots} currently in process)`}
          </p>         
          {
            spots > 0 &&
            <Fragment>
            <p>
              <span>Buy</span>
              <input className="form-control d-inline mr-3 ml-3" style={{width:'60px'}} type="number" value={quantity} onChange={({target}) => handleQuantityChange(target.value)} />
              <span>spot(s)</span>
            </p>                 
              <PayPalButton
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                          value: (props.price * quantity),
                          currency_code: 'USD',
                          breakdown: {
                              item_total: {value: (props.price * quantity), currency_code: 'USD'}
                          }
                      },
                      items: [{
                          name: `${props.title} by ${props.userName} on ${props.startDate}`,
                          unit_amount: {value: props.price, currency_code: 'USD'},
                          quantity: quantity
                      }]
                  }]
                  });
                }}      
                onSuccess={(details, data) => {
                  let newSpots = spots - (details.purchase_units[0].amount.value / props.price);
                  
                  // Celebrate
                  confetti.start();
                  setTimeout(()=> {
                    confetti.stop();
                  }, 2000);

                  // Create Payment
                  try {
                    firebase.firestore()
                    .collection('payments')
                    .add({
                      payerEmail: details.payer.email_address,
                      payerFullName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                      amount: details.purchase_units[0].amount.value,
                      timestamp: Date.now(),
                      time: DateTime.now().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
                      eventId: props.id
                    });
                  } catch (error) {
                    console.log(error);
                  }

                  // Reset quantity selector
                  setQuantity(1);

                  // Free up spots
                  updateReservedSpots(-quantity)

                  // Update spots
                  setSpots(newSpots);
                  firebase.firestore()
                    .collection('events').doc(props.id).update({
                      spots: newSpots
                    });     
                }}       
                onClick={(data, actions) => {
                  if(reservedSpots == 0) {
                    alert("Please enter the number of spots that you want to buy");
                  }
                  // Reserve spots
                  updateReservedSpots(quantity)
                }}      
                onCancel={(data, actions) => {
                  // Free up spots
                  updateReservedSpots(-quantity)
              }}                      
                options={{
                  clientId: "AXVZRyzf_0rFCSBmHoDWt7JL0KyWqPRigGlJVegtG03sbZlQKEbuSyx5v_K5Bz9hcBpkw7jVtKZM6Bij",
                  merchantId: "DHD5RS4DY4PEA"
                }}
                style={{ color: "blue", shape: "pill", label: "pay", height: 25 }}
                forceReRender={quantity}
              />   
            </Fragment>

          }   
        </div>      
      </div>  
    </div>  
  );
}

export const getServerSideProps = async ({ params }) => {
  const content = {}
  
  await firebase.firestore()
    .collection('events').doc(params.slug[0])
    .get()
    .then(docRef => {
      content['id'] = docRef.id; 
      content['title'] = docRef.data().title; 
      content['userName'] = docRef.data().userName; 
      content['startDate'] = docRef.data().startDate; 
      content['spots'] = docRef.data().spots; 
      content['price'] = docRef.data().price; 
      content['image'] = docRef.data().image? docRef.data().image : "";
    });

  await firebase.firestore()
    .collection('users').where("userName", "==", content.userName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        content['paypalMerchantId'] = doc.data().paypalMerchantId? doc.data().paypalMerchantId : "";
      });
    });    

  return {
    props: {
      id: content.id, 
      title: content.title, 
      startDate: content.startDate, 
      userName: content.userName,
      price: content.price,
      spots: content.spots,
      image: content.image,
      paypalMerchantId: content.paypalMerchantId 
    }
  }
}

export default Event