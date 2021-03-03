import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAAiDdYGqOGNeNtI1CAE7hxPITfWwBfFog",
  authDomain: "vrg-2021.firebaseapp.com",
  projectId: "vrg-2021",
  storageBucket: "vrg-2021.appspot.com",
  messagingSenderId: "1008057539735",
  appId: "1:1008057539735:web:754bccb27e4334e46a9dd2",
  measurementId: "G-BSYFN3QLCC"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const fire = firebase;
export default fire;