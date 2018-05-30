import * as firebase from 'firebase';
import * as fbConstants from '../constants/firebase.constant.js';
import * as apiUrlConstants from '../constants/apiUrl.constant.js';
import {scrollToBottom} from '../services/scrollToBottom.js';

let database
let config
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
            updateUserStatusOnline(userDetail);
        } else {
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
            let keys = Object.keys(userList);
            let nextUserId = userList[keys[0]]._id;
            dispatch(selectReceiver(userList[keys[0]]));
            dispatch(updateUserList(userList));
            checkConversation(dispatch,loggedInUserId, nextUserId);
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
export function selectReceiver(user) {

    if(user && user._id) {
        return dispatch=>{
            dispatch({type: fbConstants.SELECT_RECEIVER, payload: {selectedReceiver: user}});
        }
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
            if (convList.val() && convList.exists()) { 
                dispatchEvent(saveConversationList(convList.val()));
                dispatchEvent(getAllMessages(Object.keys(convList.val())));
            } else {
                dispatchEvent(saveConversationList({}));
            }
            
        });
    }
}

export function checkConversation (dispatch,loggedInUserId,nextUserId) {

    if(dispatch,loggedInUserId, nextUserId) {
        let myConvId = loggedInUserId+'_'+nextUserId;
        let nextUserConvId = nextUserId+'_'+loggedInUserId
        dispatch(toggleMessageLoading(true));
        dispatch(clearConversation());
        let convRefByMyConvId = database.ref('Conversations/'+loggedInUserId);
        convRefByMyConvId.once("value").then((snapshot) => {
            let allConv = snapshot.val();
            if(allConv && snapshot.hasChild(myConvId)) {
                let matchedConv = allConv[myConvId];
                dispatch(saveCurrentConvRef(matchedConv));
                dispatch(getMessagesByConvId(matchedConv)); 
            } else if(allConv && snapshot.hasChild(nextUserConvId)) {
                let matchedConv = allConv[nextUserConvId];
                dispatch(saveCurrentConvRef(matchedConv));
                dispatch(getMessagesByConvId(matchedConv));
            } else {
                dispatch(createNewConversation(loggedInUserId,nextUserId));
            }
        });
    }
};

export function createNewConversation (loggedInUserId, nextUserId) {

    return dispatch=> {
        let myConvId = ''+loggedInUserId+'_'+nextUserId;
        let nextUserConvId = ''+nextUserId+'_'+loggedInUserId
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
                        dispatch(conversationByUserId(loggedInUserId));
                        dispatch(saveCurrentConvRef(convObj));
                        dispatch(createMessageNodeByConvId(convObj));
                    });
                }
            });
        },(err)=>{
            console.log('err in save user to firebase', err);
        });
         
    }  
}

export function createMessageNodeByConvId (conv) {
    return dispatch=> {
        let msgNodeRef = database.ref('Chats/'+conv.conversationId);
        let msgObj = conv;
        delete msgObj.lastMessage;
        msgObj.message = '';
        let date = new Date();
        let timestampVal = date.getTime();
        msgObj.timestamp = timestampVal; 
        msgNodeRef.push(msgObj).then(messages=>{
            console.log('*************** first empty msg created **************');
            dispatch(getMessagesByConvId(conv));
        });
    }
}

export function getMessagesByConvId(conv) {

    return dispatch => {
        let messageNodeRef = database.ref('Chats/'+conv.conversationId);
        messageNodeRef.once('value').then(messages=>{
            if(messages.exists()){
                dispatch(saveCurrentConvMsg(messages.val()));
            } else {
                createMessageNodeByConvId(conv);
            }
            dispatch(toggleMessageLoading(false));
        });
    }
}

export function getAllMessages (convresationIdArray) {

    return dispatch=>{
        let chatRef = database.ref('Chats');
        chatRef.once('value').then((chats)=>{
            let count = 0;
            chats.forEach(function(childSnapshot, index) {
               if(convresationIdArray.indexOf(childSnapshot.key) !== -1) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();                    
                dispatch(storeAllMessages(childData, childKey));
                count++
                if(count === convresationIdArray.length) {
                    dispatch(toggleMessageLoading(false));
                }
               }
            });
        });
    }
}

export function sendMessage (msgObj) {

    return (dispatch,getState) => {
        let msgNodeRef = database.ref('Chats/'+msgObj.conversationId);
        msgNodeRef.push(msgObj).then(msg=>{
            msgNodeRef.once('value').then(msgs=>{
                dispatch(saveCurrentConvMsg(msgs.val()));
                upadateCurrentConv(msgObj);
                console.log('_______msg sent successfully_______');
            });
        });
    }
}

export function upadateCurrentConv(msgObj) {

    let senderConvRef = database.ref('Conversations/'+msgObj.from+'/'+msgObj.conversationId);
    let receiverConvRef = database.ref('Conversations/'+msgObj.to+'/'+msgObj.conversationId);
    senderConvRef.update({
        from: msgObj.from,
        to: msgObj.to,
        timestamp: msgObj.timestamp,
        lastMessage: msgObj.message
    });
    receiverConvRef.update({
        from: msgObj.from,
        to: msgObj.to,
        timestamp: msgObj.timestamp,
        lastMessage: msgObj.message
    });
}

export function watchConversations(dbRef, userId) {
    
    return (dispatch, getState)=>{
        let convRef = dbRef.ref('Conversations/'+userId);
        convRef.on('child_changed', function(data) {
            dispatch(getNewMessageByConvId(data.val()));
        });
        convRef.on('child_added', (addedConv)=>{
            let myConversations = getState().firebaseStates.myConversations;
            // console.log('my conv', myConversations);
            if(Object.keys(myConversations).length && !myConversations[addedConv.key]) {
                console.log('new conv added to my id', addedConv.val(), addedConv.key);
            }
        });
    }
}

// export function watchCurrentConversationChat(convObj) {
//     console.log('watching chat...........', convObj.conversationId);
//     return dispatch=>{
//         let chatRef = database.ref('Chats/'+convObj.conversationId);
//         console.log('changed chat node ref ', chatRef);
//         chatRef.on('child_added', function(data) {
//             console.log('chats child changed ...', data.val(),data.key);
//             // dispatch(saveCurrentConvMsg(data.val(), data.key));
//         });
//     }
// }

export function getNewMessageByConvId (conversationObj) {
    
    return (dispatch, getState)=>{
        let chatRef = database.ref('Chats/'+conversationObj.conversationId);
        chatRef.once('value').then(snapshot=>{
            let allMsgs = snapshot.val();
            let allMsgsKey = Object.keys(allMsgs);
            let newMsgKey = allMsgsKey[allMsgsKey.length-1];
            let newMsgObj = allMsgs[newMsgKey];
            let state = getState().firebaseStates;
            let allConvObj = state.allConversationMessages;
            allConvObj[conversationObj.conversationId][newMsgKey] = newMsgObj;
            dispatch(storeAllMessages(allConvObj[conversationObj.conversationId], conversationObj.conversationId));
            if(state.currentConversationRef.conversationId === conversationObj.conversationId && !state.currentConversationMessages[newMsgKey]) {
                console.log('.............. new msg key does not exist ..........', newMsgKey);
                dispatch(saveCurrentConvMsg(allConvObj[conversationObj.conversationId]));
            }
        })
    }
}

function saveConversationList(convList) {

    return{type: fbConstants.SAVE_MY_CONVERSATION_LIST, payload: {myConversations: convList}};
}

export function toggleMessageLoading(status) {

    return dispatch=>{
        dispatch({type: fbConstants.MSG_LOADING, payload:{messageLoading: status}});
    };
}

export function clearConversation () {
    let emptyConvRef = {
        conversationId : "",
        from : "",
        lastMessage : "",
        timestamp : null,
        to : ""
    }
    return{type: fbConstants.CLEAR_CONV, payload:{currentConversationRef: emptyConvRef,currentConversationMessages: {}}};
}

export function saveCurrentConvRef (conv) {

    return{type: fbConstants.STORE_CONV_REF, payload:{currentConversationRef: conv}};
}

export function storeAllMessages(data, conversationId) {
    
    return dispatch => {
        dispatch({type: fbConstants.STORE_ALL_CONV_MSGS, payload: {data:data, childKey: conversationId}});
    }
}

export function saveCurrentConvMsg(messages, msgId) {

    return dispatch=>{
        scrollToBottomOfDiv();
        if(msgId) {
            dispatch({type: fbConstants.STORE_CONV_MSGS, payload: {currentConversationMessages: messages, newMsgKey: msgId}});
        } else {
            dispatch({type: fbConstants.STORE_CONV_MSGS, payload: {currentConversationMessages: messages}});
        }
    }

}
export function updateCurrentConvMsg (msg, msgKey) {

    return dispatchEvent=>{
        dispatchEvent({type: fbConstants.STORE_UPDATED_MSG,payload:{newMsgKey: msgKey ,message: msg}});
        scrollToBottomOfDiv();
    }
}

export function scrollToBottomOfDiv() {

    setTimeout(()=>{
        let msgDivElem = document.getElementById('msgListContainer');
        scrollToBottom(msgDivElem,400);
    },100);
}

