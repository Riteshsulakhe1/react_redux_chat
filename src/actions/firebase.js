import * as firebase from 'firebase';
import * as fbConstants from '../constants/firebase.constant.js';
import * as apiUrlConstants from '../constants/apiUrl.constant.js';
// import {promise} from 'react';
// console.log('promis', promise);
let database
let config
let dbRef
let userNodeRef
let auth
let userList = {};
let chatNodeRef;
let conversationNodeRef;

export function getConfigs (userId) {

    return dispatchEvent =>{
        const url = apiUrlConstants.BASE_URL+'/credentials?_id='+localStorage.getItem('token');
        fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then((response)=>{
            response.json().then((configs)=>{
                dispatchEvent( updateConfigs(configs));
                config = {
                    apiKey: configs.apiKey,
                    authDomain: configs.authDomain,
                    databaseURL: configs.databaseURL,
                    projectId: configs.projectId,
                    storageBucket: configs.storageBucket,
                    messagingSenderId: configs.messagingSenderId
                }
                firebase.initializeApp(config)
                database = firebase.database();
                console.log('firebase initialized....', firebase);
                dispatchEvent(setFirebaseReference(firebase));
                dispatchEvent(setDbReference(database));
            });
        }).catch((err)=>{
            console.log('err in get configs', err);
        });
    }
};

export function updateConfigs (configData) {

    return{ type: 'SET_FIREBASE_CONFIGS', payload: configData};
}

export function checkUserExistanceInFb(userDetail) {

    userNodeRef = database.ref('Users');
    userNodeRef.child(userDetail._id).once('value').then(user=>{
        if(user.hasChild(userDetail._id)){
            console.log('user already exist in fb .....',user);
            updateUserStatusOnline(userDetail);
        } else {
            console.log('adding new user to fb', user);
            addGoogleUserToFb(userDetail);
        }
    })
}

export function addGoogleUserToFb (user){

    let userDetail = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      lastSeen: '',
      status: 'Online'
    }
    userNodeRef = database.ref('Users/'+user._id);
    userNodeRef.set(userDetail).then((savedUser)=>{
      console.log('google user saved in firebase db .........', userDetail);
    },(err)=>{
      console.log('err in save user to firebase', err);
    });
}

export function addNormalUserToFb(user) {
 
    return new Promise((resolve, reject)=>{
        let userDetail = {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            lastSeen: '',
            status: 'Online'
        }
        userNodeRef = database.ref('Users/'+user._id);
        userNodeRef.set(userDetail)
        .then((res)=>{
            userDetail.firebaseId = userDetail._id;
            resolve(userDetail);
            // console.log('saved in fb........', res);
        },(err)=>{
            console.log('err in save to fb', err);
            reject(err);
        })
    })
}

export function getUserList (){
    
    return dispatch=>{
        dispatch(toggleFetchUserLoading(true));
        var usersRef = database.ref('Users');
        usersRef.once('value', function(snapshot) {
          let exists = (snapshot.val() !== null);
          if(exists) {
            let userList = snapshot.val();
            let loggedInUserId = localStorage.getItem('token');
            delete userList[loggedInUserId];
            dispatch(updateUserList(userList));
            dispatch(toggleFetchUserLoading(false));
          }
        });
    }
}

export function Authenticate(){

    let provider = new firebase.auth.GoogleAuthProvider();
    auth = firebase.auth();
    return auth.signInWithPopup(provider);
}

export function logOut(user) {

    updateUserStatusOffline(user);
    updateLastSeen(user);
    return firebase.auth().signOut()
}

export function updateUserStatusOnline (user){
    console.log('user to update status online', user);
    if(user){
      var usersRef = database.ref('Users/'+user._id);
      usersRef.once('value').then(snapshot=>{
          if(snapshot.exists()) {
            usersRef.update({
                status: 'Online'
            });
            getUserList();
          }
      })
  
    }
}
  
function updateUserStatusOffline (user){
    if(user){
        var usersRef = database.ref('Users/'+user._id);
        usersRef.update({
        status: 'Offline'
        })
    }
}

function updateLastSeen(user) {
    if(user) {
        var date = new Date();
        var timestamp = date.getTime();
        var usersRef = database.ref('Users/'+user._id);
        usersRef.update({
        lastSeen: timestamp
        })
    }
}

function setFirebaseReference(ref) {

    return{type: fbConstants.SET_FIREBASE_REFRENCE, payload: {firebaseRef: ref, isFbInitialized: true}};
}

function setDbReference(dbRef) {

    return{type: fbConstants.SET_DATABASE_REFRENCE, payload:{dbRef: dbRef}};
}

function toggleFetchUserLoading (status) {

    return{type: fbConstants.FETCH_USER_LOADING_STATUS, payload:{fetchUserLoading: status}};
}

function updateUserList (users) {

    return {type: fbConstants.UPDATE_FIRE_USER_LIST, payload:{userList: users}};
}

///////////////Messages actions///////////////////
export function conversationByUserId (userId) {

    return dispatchEvent=>{
        conversationNodeRef = database.ref('Conversations/'+userId);
        conversationNodeRef.once('value').then(convList=>{
            if (convList.exists()) { 
                dispatchEvent(saveConversationList(convList.val()));
            } else {
                dispatchEvent(saveConversationList([]));
            }
            
        });
    }
}

export function checkConversation (loggedInUserId,nextUserId) {

    let myConvId = loggedInUserId+'_'+nextUserId;
    let nextUserConvId = nextUserId+'_'+loggedInUserId
    return dispatch=>{
        dispatch(toggleMessageLoading(true));
        dispatch(clearConversation());
        //check for conv created by me
        // let convRefByMyConvId = database.ref('Conversations/'+loggedInUserId+'/'+myConvId);
        // convRefByMyConvId.once("value").then((snapshot) => {
        //     if (!snapshot.exists()) { 
        //         //check for conv created by next user
        //         let convRefByNextConvId = database.ref('Conversation/'+loggedInUserId+'/'+nextUserConvId);
        //         convRefByNextConvId.once('value').then(conv=>{
        //             if(!conv.exists()) {
        //                 createNewConversation(dispatch, loggedInUserId,nextUserId)
        //             } else {
        //                 watchConversations(dispatch, nextUserConvId);
        //                 dispatch(saveCurrentConvRef(conv.val()));
        //                 getMessagesByConvId(dispatch, conv.val());
        //             }
        //         })
        //     } else {
        //         watchConversations(dispatch, myConvId);
        //         dispatch(saveCurrentConvRef(snapshot.val()));
        //         getMessagesByConvId(dispatch, snapshot.val());
        //     }
        // });
        let convRefByMyConvId = database.ref('Conversations/'+loggedInUserId);
        convRefByMyConvId.once("value").then((snapshot) => {
            if(snapshot.hasChild(myConvId)) {
                watchConversations(dispatch, myConvId);
                dispatch(saveCurrentConvRef(snapshot.val()));
                getMessagesByConvId(dispatch, snapshot.val()); 
            } else if(snapshot.hasChild(nextUserConvId)) {
                watchConversations(dispatch, nextUserConvId);
                dispatch(saveCurrentConvRef(snapshot.val()));
                getMessagesByConvId(dispatch, snapshot.val());
            } else {
                createNewConversation(dispatch, loggedInUserId,nextUserId)
            }
        });
    }
};

function createNewConversation (dispatch ,loggedInUserId, nextUserId) {

    let myConvId = loggedInUserId+'_'+nextUserId;
    let nextUserConvId = nextUserId+'_'+loggedInUserId
    let date = new Date();
    let timestamp = date.getTime();
    let convObj = {
        conversationId: myConvId,
        from: loggedInUserId,
        to: nextUserId,
        lastMessage: '',
        timestamp: timestamp
    }
    let conversationNodeRef = database.ref('Conversations/'+loggedInUserId+'/'+myConvId);
    conversationNodeRef.set(convObj).then((convCreated)=>{
        console.log('conv created in fb .........', convCreated);
        let nextUserConvRef = database.ref('Conversations/'+nextUserId+'/'+myConvId);
        nextUserConvRef.once('value').then(conv=>{
            if(!conv.exists()) {
                let date = new Date();
                let timestamp1 = date.getTime();
                convObj.timestamp = timestamp1;
                nextUserConvRef.set(convObj).then(nextUserConv=>{
                    dispatch(saveCurrentConvRef(convObj));
                    getMessagesByConvId(dispatch,convObj);
                    watchConversations(dispatch, myConvId);
                });
            }
        })
    },(err)=>{
        console.log('err in save user to firebase', err);
    });   
}

export function createMessageNodeByConvId (dispatch,conv) {

    let msgNodeRef = database.ref('Chats/'+conv.conversationId);
    let msgObj = conv;
    delete msgObj.lastMessage;
    msgObj.message = '';
    let date = new Date();
    let timestampVal = date.getTime();
    msgObj.timestamp = timestampVal; 
    msgNodeRef.push(msgObj).then(messages=>{
        console.log('first msg created');
        dispatch(toggleMessageLoading(false));
        watchChats(dispatch, conv.conversationId);
    });
}

export function getMessagesByConvId(dispatch,conv) {

    console.log('get messages', dispatch, conv);
    let messageNodeRef = database.ref('Chats/'+conv.conversationId);
    messageNodeRef.once('value').then(messages=>{
        if(messages.exists()){
            console.log('fetched msgs', messages.val());
            dispatch(saveCurrentConvMsg(messages.val()));
            watchChats(dispatch, conv.conversationId);
            dispatch(toggleMessageLoading(false));
        } else {
            createMessageNodeByConvId(dispatch,conv);
            dispatch(toggleMessageLoading(false));
        }
    })
}

export function sendMessage (msgObj) {

    return dispatch => {
        let msgNodeRef = database.ref('Chats/'+msgObj.conversationId);
        msgNodeRef.push(msgObj).then(msg=>{
            console.log('msg sent successfully', msg);
            getMessagesByConvId(dispatch,msgObj);
        });
    }
}

function watchConversations(dispatch, userId) {
    let convRef = database.ref('Conversations/'+userId);
    convRef.on('child_changed', function(data) {
        console.log('conversation child changed ...', data.val());
    });
}

function watchUsers(dispatch) {
    let userRef = database.ref('Users');
    userRef.on('child_changed', function(data) {
        console.log('users child changed ...', data.val());
    });
}

function watchChats(dispatch, conversationId) {
    console.log('watching chats,.........')

    let chatRef = database.ref('Chats/'+conversationId);
    chatRef.on('child_changed', function(data) {
        console.log('chats child changed ...', data.val());
    });
}

function saveConversationList(convList) {

    return{type: fbConstants.SAVE_MY_CONVERSATION_LIST, payload: {myConversations: convList}};
}

function toggleMessageLoading(status) {

    return{type: fbConstants.MSG_LOADING, payload:{messageLoading: status}};
}

function clearConversation () {

    return{type: fbConstants.CLEAR_CONV, payload:{currentConversationMessages: []}};
}

function saveCurrentConvRef (conv) {

    return{type: fbConstants.STORE_CONV_REF, payload:{currentConversationRef: conv}};
}

function saveCurrentConvMsg(msgList, msgId) {
    if(msgId) {
        return {type: fbConstants.STORE_CONV_MSGS, payload:{currentConversationMessages: msgList, newMsgKey: msgId}}
    } else {
        return {type: fbConstants.STORE_CONV_MSGS, payload:{currentConversationMessages: msgList}}
    }
}

