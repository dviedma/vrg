import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import {firebase} from '../../config/fire-config';

const Nav = () => {

  const user = useSelector ((state) => state.user);

  const handleLogout = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        // logged out
      });
    }
      

  return (
    <nav className="navbar navbar-expand navbar-light pb-2" id="top-nav">
      {/*<a className="navbar-brand" href="https://www.wowza.com"><img className="noll"  src={wowzaLogo}} alt="Wowza Media Systems" /></a>*/}
      <Link href="/">
        <a><img src="/images/logo.svg" alt="VRG Logo" width="100px"/></a>
      </Link>
      <ul className="navbar-nav ml-auto d-sm-flex">
        {!user.loggedIn?
          <Fragment>
            <li className="nav-item ml-3">
            <Link href="/register">
                <a>Register</a>
              </Link>
            </li>
            <li className="nav-item ml-3"> 
              <Link href="/login">
                <a> Login</a>
              </Link>
            </li>
          </Fragment>
        :
          <Fragment>
            <li className="nav-item ml-3 nav-item__user">
              Hello, <a href="/profile">{user.currentUser.displayName}</a>
            </li>
            <li className="nav-item ml-3">
              <button onClick={handleLogout} className="btn">Logout</button>
            </li>
          </Fragment>
        }
      </ul>
    </nav>
  );
}

export default Nav;
