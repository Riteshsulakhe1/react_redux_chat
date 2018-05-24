import * as apiUrlConstants from '../constants/apiUrl.constant.js';

export function fetchUser () {

    return dispatch =>{
        dispatch(fetchUserStart());
        const url = apiUrlConstants.BASE_URL+'/userList';
        fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then(response =>{
            response.json().then(users=>{
                dispatch(updateUserArray(users));
                dispatch(fetchUserCompleted());
            })
        })    
        .catch(error => dispatch(fetchUserError(error)));
    }
}
export function getLoggedInUser (id) {
    return dispatch =>{
        dispatch(fetchUserStart());
        const url = apiUrlConstants.BASE_URL+'/getLoggedInUser/?id='+id;
        fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then(response =>{
            response.json().then(users=>{
                dispatch(saveLoggedInUser(users));
            })
        })    
        .catch(error => dispatch(fetchUserError(error)));
    }
}
export function selectUser (user) {

    return {type: 'SELECT_USER', payload:{selectedUser: user}}
}
export function fetchUserCompleted () {

    return {'type': 'FETCH_USER_COMPLETED', payload:{showUserLoading: false}};
}
export function fetchUserStart () {

    return {'type': 'FETCH_USER_START', payload:{showUserLoading: true}};
}
export function fetchUserError (err) {

    return {'type': 'FETCH_USER_ERROR', payload:{showUserLoading: false, fetchUserError: err}};
}
export function updateUserArray (users) {

    return {'type': 'UPDATE_USER_LIST', payload:{userList: users}};
}
export function saveLoggedInUser (user) {

    return { 'type': 'LOGGED_IN_USER', payload: {loggedInUser: user}};
}
export function clearSelectedUser () {

    return {'type': 'CLEAR_SELECTED_USER', payload: {selectedUser: {}}};
}
export function logout () {

    return { 'type': 'LOGOUT', payload: {loggedInUser: {}}};
}
export function auth (user){

    return {type: 'AUTHENTICATE_USER', payload:{loggedInUser: user}};
}