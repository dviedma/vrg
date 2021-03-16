import firebase from "firebase/app";
import 'firebase/analytics';
import 'firebase/firebase-firestore';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: "AIzaSyAAiDdYGqOGNeNtI1CAE7hxPITfWwBfFog",
  authDomain: "vrg-2021.firebaseapp.com",
  projectId: "vrg-2021",
  storageBucket: "vrg-2021.appspot.com",
  messagingSenderId: "1008057539735",
  appId: "1:1008057539735:web:754bccb27e4334e46a9dd2",
  measurementId: "G-BSYFN3QLCC"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const analytics = firebase.analytics;

export { firebase, analytics };