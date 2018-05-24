import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Routes from './routes.js';
import createHistory from 'history/createBrowserHistory'
import {Provider} from 'react-redux';
import configureStore from './store.js';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';



// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)
const store = configureStore({}, middleware);

// store.dispatch(getConfigs());
// store.subscribe(()=>{
//     console.log('store changed', store.getState())
// });

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            <ConnectedRouter history={history}>
                <Routes/>
            </ConnectedRouter>
        </MuiThemeProvider>    
    </Provider>, 
    document.getElementById('root'));
registerServiceWorker();
