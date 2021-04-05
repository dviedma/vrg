import { useState, useEffect, Fragment } from 'react';
import {firebase} from '../../config/fire-config';
import { useRouter } from 'next/router'

const EditProfile = () => {
  const [notify, setNotification] = useState('');
  const [resetPasswordLink, setResetPasswordLink] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [paypalMerchantId, setPaypalMerchantId] = useState("");

  const router = useRouter();

  useEffect(() => {
    console.log("hi");

    // Get logged in state
    firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          firebase.firestore()
            .collection('users').where("userName", "==", user.displayName)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach((doc) => {

                setAbout(doc.data().about);
                setWebsite(doc.data().website);
                setTwitter(doc.data().twitter);
                setInstagram(doc.data().instagram);
                setYoutube(doc.data().youtube);
                setPaypalMerchantId(doc.data().paypalMerchantId);

                setCurrentUser({
                  id: doc.id,
                  ...doc.data()
                });
              });
            });                  
        } else {
          setCurrentUser({})
          router.push("/login")
        }
      })
  }, []);

  const handleOnClick = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(currentUser.email)
      .then((link) => {
        setNotification('Success sending reset password email. Look in your inbox!')

        setTimeout(() => {
          setNotification('')
        }, 3000)        
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleEdit = (e) => {
    e.preventDefault();

    firebase.firestore()
      .collection('users').doc(currentUser.id).update({
        youtube: youtube,
        about: about,
        instagram: instagram,
        twitter: twitter,
        website: website
      })
      .then((link) => {
        setNotification('Saved!')

        setTimeout(() => {
          setNotification('')
        }, 3000)    
      });
  };

  return (
    <div className="login container-fluid mt-5">
      <div className="row justify-content-sm-center">
        <div className="col col-sm-5 input-group">
          <h1 style={{display:'contents'}} className="mb-4">{currentUser.userName}</h1>
          <span style={{lineHeight:'44px'}} className="ml-3">
            <a href="#" onClick={handleOnClick}>Send Password Reset Email</a> 📩
          </span>
          <form onSubmit={handleEdit} className="mt-3">
            <label className="form-label">Email</label>
            <input style={{background:'lightgrey'}} className="form-control" type="text" value={currentUser.email} disabled />
            <label className="form-label mt-3">About Your Channel</label>
            <textarea placeholder="Write something funny | NBA | NFL In for the fun 🏈 🏀 🏏" className="form-control" type="text" value={about} onChange={({target}) => setAbout(target.value)}/>                      
            <label className="form-label mt-3">My Website</label>
            <input className="form-control" type="text" value={website} onChange={({target}) => setWebsite(target.value)}/>  
            <label className="form-label mt-3">Youtube URL</label>
            <input className="form-control" type="text" value={youtube} onChange={({target}) => setYoutube(target.value)}/>   
            <label className="form-label mt-3">Instagram URL</label>
            <input className="form-control" type="text" value={instagram} onChange={({target}) => setInstagram(target.value)}/>                              
            <label className="form-label mt-3">Twitter URL</label>
            <input className="form-control" type="text" value={twitter} onChange={({target}) => setTwitter(target.value)}/>      
            <label className="form-label mt-3">PayPal Merchant ID <a target="_blank" href="https://chargebackhelp.com/what-is-a-paypal-merchant-identification-number/">What is the PayPal Merchant ID and how can I get it?</a></label>
            <input className="form-control" type="text" value={paypalMerchantId} onChange={({target}) => setPaypalMerchantId(target.value)}/>      
            <button className="btn mt-3" type="submit">Save</button>
          </form>
          <p className="login-message mt-3">{notify}</p>
        </div>
      </div>
    </div>
  )

}

export default EditProfile
