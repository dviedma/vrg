import * as UserActions from '../actions/userActions';

const initialState = {
  loggedIn: false,
  currentUser: {}
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UserActions.SET_USER_LOGGED_IN:
      return { currentUser:action.currentUser, loggedIn: true };
    case UserActions.SET_USER_LOGGED_OUT:
      return { currentUser: {}, loggedIn: false };
    default:
      return state
  }
}

export default userReducer;
