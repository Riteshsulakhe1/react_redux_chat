import * as fbConstants from '../constants/firebase.constant.js';

const initialState = {
    firebaseRef: null,
    dbRef: null,
    isFbInitialized: false,
    fetchUserLoading: false,
    fetchUserError: null,
    userList: {},
    myConversations: {},
    currentConversationRef: null,
    currentConversationMessages : {},
    allConversationMessages: {},
    messageLoading: false,
    selectedReceiver: {}
}

export function firebaseReducer(state = initialState, action) {

    switch(action.type) {

        case fbConstants.SET_FIREBASE_REFRENCE:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.SET_DATABASE_REFRENCE:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.FETCH_USER_LOADING_STATUS:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.UPDATE_FIRE_USER_LIST:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.SELECT_RECEIVER:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.STORE_CONV_REF:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.CLEAR_CONV:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.CLEAR_CONV:
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.SAVE_MY_CONVERSATION_LIST:
        {
            
            state = Object.assign({}, state, action.payload);
            break;
        }
        case fbConstants.STORE_CONV_MSGS:
        {
            if(action.payload.newMsgKey) {
                let convObj = state.currentConversationMessages;
                convObj[action.payload.newMsgKey] = action.payload.currentConversationMessages;
                let modifiedObj = {currentConversationMessages: convObj}
                state = Object.assign({}, state, modifiedObj);
            } else {
                state = Object.assign({}, state, action.payload);
            }
            break;
        }
        case fbConstants.STORE_ALL_CONV_MSGS:
        {
            if(action.payload.childKey) {
                let convObj = state.allConversationMessages;
                convObj[action.payload.childKey] = action.payload.data;
                let modifiedObj = {allConversationMessages: convObj}
                state = Object.assign({}, state, modifiedObj);
            } 
            // else {
            //     state = Object.assign({}, state, action.payload);
            // }
            break;
        }
        // case fbConstants.SET_FIRST_COV_REF:
        // {
        //     let convRef;
        //     if(state.myConversations[action.payload.myConvId]) {
        //         convRef = state.myConversations[action.payload.myConvId]
        //     } else {
        //         convRef = state.myConversations[action.payload.myConvId]
        //     }
        //     state = Object.assign({}, state, action.payload);
        //     break;
        // }
        case fbConstants.MSG_LOADING:
        {
            
            state = Object.assign({}, state, action.payload);
            break;
        }
        
        default: return state;
    }

    return state;
}