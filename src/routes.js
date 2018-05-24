import React from 'react';
import {Route} from 'react-router';
import App from './components/app/App.js';
import Register from './components/app/register.js';
import Login from './components/app/login';
import User from './components/user/user.js';
import Profile from './components/user/profile.js';
import Books from './components/books/books.js';
import Chat from './components/chats/chat.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getLoggedInUser} from './actions/user';
import{getConfigs}from './actions/config.js';
import { withRouter } from 'react-router-dom';
// import {init as firebaseInit} from './components/firebase/firebase.js'
import * as firebaseInit from './actions/firebase.js';
export let counter = 0;

class Routes extends React.Component {

    componentWillMount ()
    {
        const token = localStorage.getItem('token');
        this.props.dispatch(firebaseInit.getConfigs(token));
        if(token) {
            this.props.dispatch(getLoggedInUser(token));
        }
    }
    componentWillReceiveProps()
    {
        // setTimeout(()=>{

        //     if(this.props && this.props.firebaseConfig && this.props.firebaseConfig.apiKey && counter === 0)
        //     {
        //         firebaseInit(this.props.firebaseConfig);
        //         counter++
        //     }
        // },1000)
    }
    render(){
        return(
            <div style={styles.app_main_container}>
                <Route path="/" component={App}></Route>
                <Route path="/signUp" component={Register}></Route>
                <Route path="/signIn" component={Login}></Route>
                <Route path="/users" component={User}></Route>
                <Route path="/user/profile" component={Profile}></Route>
                <Route path="/books" component={Books} />
                <Route path="/user/chats" component={Chat}/>
            </div>
        )
    }
}
const styles = theme=>({
    app_main_container:{
      height: '100% !important',
      overflowY:'hidden',
      overflowX: 'hidden'
    },
});    
function mapStateToProps(state) {
    return {
        history: state.history,
        firebaseConfig: state.configs
    }
}
function mapDispatchToProps(dispatch) {
    let actions = bindActionCreators({ getLoggedInUser, getConfigs });
    return { ...actions, dispatch };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
