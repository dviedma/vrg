import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";

import fire from '../../config/fire-config';

const Event = (props) => {
  let [spots, setSpots] = useState(props.spots);
  let image = (props.image)? props.image : "/images/box-placeholder.jpg";

  return (
    <div className="container mt-5">
      <div className="row justify-content-sm-center">
        <div className="col-sm-7">
          <img src={image} width="100%"/>
        </div>
        <div className="col-sm-5">
          <h1 className="d-block">{props.title}</h1>
          <h2 className="mt-3 d-block">${props.price}</h2>
          <p className="mt-3 d-block">{spots} spots available</p>  
          {
            spots > 0 &&
            <PayPalButton
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                      value: props.price,
                      currency_code: 'USD',
                      breakdown: {
                          item_total: {value: props.price, currency_code: 'USD'}
                      }
                  },
                  items: [{
                      name: `${props.title} by ${props.userName} on ${props.startDate}`,
                      unit_amount: {value: props.price, currency_code: 'USD'},
                      quantity: '1'
                  }]
              }]
              });
            }}                
            onSuccess={(details, data) => {
              let newSpots = spots - 1;

              // Celebrate
              confetti.start();
              setTimeout(()=> {
                confetti.stop();
              }, 2000);

              // Update spots
              setSpots(newSpots);
              fire.firestore()
              .collection('events').doc(props.id).update({
                spots: newSpots
              });     
            }}             
            options={{
              clientId: "AXS3AfceAxeZzmSDiOS_NfLcG5ioqXDZUtSyJtl7ctXqLfBxyRr_jPuiNzpIaIIyZHqHbXjjp1T7qxSw",
              merchantId: "6VQF5USW5N7BA"
            }}
            style={{ color: "blue", shape: "pill", label: "pay", height: 25 }}
          />   
          }   
        </div>      
      </div>  
    </div>  
  );
}

export const getServerSideProps = async ({ params }) => {
  const content = {}
  
  await fire.firestore()
    .collection('events').doc(params.slug[0])
    .get()
    .then(docRef => {
      content['id'] = docRef.id; 
      content['title'] = docRef.data().title; 
      content['userName'] = docRef.data().userName; 
      content['startDate'] = docRef.data().startDate; 
      content['spots'] = docRef.data().spots; 
      content['price'] = docRef.data().price; 
      content['image'] = docRef.data().image; 
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