import * as apiUrlConstants from '../constants/apiUrl.constant.js';

export function login(){

}
export function register(userData) {

    return dispatch => {
        const url = apiUrlConstants.BASE_URL+'/saveUser';
        return fetch(url, {
          method: 'POST',
          headers: new Headers({
          'Content-Type': 'application/json'
          }),
          body: JSON.stringify(userData)
        });
    }
}
export function setLoggedInUser(user) {

    return { 'type': 'LOGGED_IN_USER', payload: {loggedInUser: user}};
}
export function registerGoogleUser (user) {

    return dispatch => {
        const url = apiUrlConstants.BASE_URL+'/GoogleUser';
        return fetch(url, {
          method: 'POST',
          headers: new Headers({
          'Content-Type': 'application/json'
          }),
          body: JSON.stringify(user)
        });
    }
}
export function getGoogleUser (user) {

    return dispatch => {
        const url = apiUrlConstants.BASE_URL+'/GoogleUser/?email='+user.email+'&&signInWithGoogle='+true;
        return fetch(url, {
          method: 'GET',
          headers: new Headers({
          'Content-Type': 'application/json'
          })
        });
    }
}