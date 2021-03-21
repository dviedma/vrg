import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";

import {firebase} from '../../config/fire-config';

const Event = (props) => {
  let [spots, setSpots] = useState(props.spots);
  let [quantity, setQuantity] = useState(1);
  let image = (props.image)? props.image : "/images/box-placeholder.jpg";

  const handleQuantityChange = (value) => {
    if(value <= spots) {
      setQuantity(value);
    }
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
          <p className="mt-3 pb-3 mb-3 d-block" style={{borderBottom:'1px solid rgba(255,255,255,0.5)'}}>{spots} spots available</p>         
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

                  // Update spots
                  setSpots(newSpots);
                  firebase.firestore()
                  .collection('events').doc(props.id).update({
                    spots: newSpots
                  });     
                }}             
                options={{
                  clientId: "AbqZIB7XWLrIR7hRUdRORAh6bs74gEIyqthvXGvW92cO0alm69MKQiUz8GxEkLcndaLCKtmoEYtAWnFr"
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

  return {
    props: {
      id: content.id, 
      title: content.title, 
      startDate: content.startDate, 
      userName: content.userName,
      price: content.price,
      spots: content.spots,
      image: content.image 
    }
  }
}

export default Event