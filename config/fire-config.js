import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAnRDHwtQ1djyuuipA9-mmMG8WU5n2eFo4",
  authDomain: "blogapp-5d1b6.firebaseapp.com",
  projectId: "blogapp-5d1b6",
  storageBucket: "blogapp-5d1b6.appspot.com",
  messagingSenderId: "99449019992",
  appId: "1:99449019992:web:6b8d0e124d2b7f1ce4742d"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const fire = firebase;
export default fire;