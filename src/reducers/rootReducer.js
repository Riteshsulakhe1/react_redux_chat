import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import {userListReducer} from './user.js';
import {bookReducer} from './books.js';
import {firebaseReducer} from './firebase.js';
import {ConfigReducer} from './config.js';

const rootReducer = combineReducers({
    
    router: routerReducer,
    userStates:userListReducer,
    bookStates: bookReducer,
    configs: ConfigReducer,
    firebaseStates: firebaseReducer
});

export default rootReducer;
