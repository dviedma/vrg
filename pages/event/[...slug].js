import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iframe from 'react-iframe'

import fire from '../../config/fire-config';

const Event = (props) => {

  return (
    <div className="container mt-5">
      <div className="row justify-content-sm-center">
        <div className="col-sm-7">
          <img src="/images/box-placeholder.jpg" width="100%"/>
        </div>
        <div className="col-sm-5">
          <h1>{props.title}</h1>     
          <Iframe url={'/paypal-button.html?paypalMerchantId=6VQF5USW5N7BA'}
                  width="200px"
                  height="400px"
                  id="myId"
                  className="myClassname"
                  display="initial"
                  style={{border:'none'}}
                  position="relative"/>        
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
      console.log(docRef.data())
      content['title'] = docRef.data().title; 
    });

  return {
    props: {
      title: content.title, 
    }
  }
}

export default Event