// import * as firebase from 'firebase';
// import * as firebaseActions from '../../actions/firebase.js';
// import React from 'react';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';

// let database
// let config
// let dbRef
// let userNodeRef
// let auth
// let userList = {};
// // let chatNodeRef

// export const init = (props) => {

//   // config = {
//   //   apiKey: props.apiKey,
//   //   authDomain: props.authDomain,
//   //   databaseURL: props.databaseURL,
//   //   projectId: props.projectId,
//   //   storageBucket: props.storageBucket,
//   //   messagingSenderId: props.messagingSenderId
//   // }
//   // firebase.initializeApp(config)
//   // database = firebase.database();
//   // console.log('firebase initialized....', firebase);
  
// }

// export function Authenticate(){

//   let provider = new firebase.auth.GoogleAuthProvider();
//   auth = firebase.auth();
//   return auth.signInWithPopup(provider);
// }

// export function logOut(user) {
//   updateUserStatusOffline(user);
//   updateLastSeen(user);
//   return firebase.auth().signOut()
// }

// export function getDbRef(){

//   dbRef = database.ref(''+config.projectId);
// }

// export function addUserToDb (user){

//   let userDetail = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     picture: user.picture,
//     lastSeen: '',
//     status: 'Online'
//   }
//   userNodeRef = database.ref('Users/'+user._id);
//   userNodeRef.set(userDetail).then((savedUser)=>{
//     console.log('user saved in firebase db .........', userDetail);
//   },(err)=>{
//     console.log('err in save user to firebase', err);
//   });
// }

// export function getUserList (user){

//   var usersRef = database.ref('Users');
//   usersRef.once('value', function(snapshot) {
//     let exists = (snapshot.val() !== null);
//     if(exists) {
//       let userList = snapshot.val();
//       console.log('user list', userList);
//       let loggedInUserId = localStorage.getItem('token');
//       console.log('user', userList[loggedInUserId]);
//       delete userList[loggedInUserId];
//       console.log('updated user list', userList);
//     }
//   });
// }
// export function updateUserStatusOnline (user){
//   if(user){
//     var usersRef = database.ref('Users/'+user._id);
//     usersRef.update({
//       status: 'Online'
//     });
//     getUserList();

//   }
// }

// function updateUserStatusOffline (user){
//   if(user){
//     var usersRef = database.ref('Users/'+user._id);
//     usersRef.update({
//       status: 'Offline'
//     })
//   }
// }

// function updateLastSeen(user) {
//  if(user) {
//     var date = new Date();
//     var timestamp = date.getTime();
//     var usersRef = database.ref('Users/'+user._id);
//     usersRef.update({
//       lastSeen: timestamp
//     })
//  }
// }

