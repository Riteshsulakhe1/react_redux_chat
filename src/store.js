import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import rootReducer from './reducers/rootReducer.js';


const configureStore = function(initialState, historyMiddleware) {
    
    return createStore(rootReducer, initialState, applyMiddleware(thunk, createLogger(), historyMiddleware))
}
export default configureStore;