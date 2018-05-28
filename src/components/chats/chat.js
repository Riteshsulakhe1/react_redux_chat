import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as firebaseActions from '../../actions/firebase.js';

//Material dependencies
import {CircularProgress} from 'material-ui/Progress';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

//css 
import './chat.css';

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
        }
    }
    componentWillMount() {

        if(this.props.isFbInitialized) {
            this.props.dispatch(firebaseActions.conversationByUserId(this.props.loggedInUser._id));
            this.props.dispatch(firebaseActions.watchConversations(this.props.dbRef,this.props.loggedInUser._id));
            this.props.dispatch(firebaseActions.getUserList(this.props.allConversationMessages));
        }
    }

    selectUserForChat (user) {

        if(user && this.props.selectedReceiver._id !== user._id) {
            let myConvId = this.props.loggedInUser._id+'_'+user._id;
            let nextUserConvId = user._id+'_'+this.props.loggedInUser._id;
            this.props.dispatch(firebaseActions.selectReceiver(user));
            this.props.dispatch(firebaseActions.clearConversation());
            if(this.props.myConversations !== {}) {
                if(this.props.myConversations.hasOwnProperty(myConvId)) {
                    this.props.dispatch(firebaseActions.saveCurrentConvRef(this.props.myConversations[myConvId]));
                    this.props.dispatch(firebaseActions.setCurrentConvMsgs(this.props.allConversationMessages[myConvId]));
                } else if(this.props.myConversations.hasOwnProperty(nextUserConvId)) {
                    this.props.dispatch(firebaseActions.saveCurrentConvRef(this.props.myConversations[nextUserConvId]));
                    this.props.dispatch(firebaseActions.setCurrentConvMsgs(this.props.allConversationMessages[nextUserConvId]));
                } else {
                    this.props.dispatch(firebaseActions.createNewConversation(this.props.loggedInUser._id, user._id)); 
                }
            } else {
                this.props.dispatch(firebaseActions.createNewConversation(this.props.loggedInUser._id, user._id));
            }
        }
    };

    setInputValue(event) {
     
        if(event.target) {
          this.setState({message: event.target.value});
        }
    }

    handleKeyPress (e) {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    };

    sendMessage () {

        if(this.state.message) {
            let date = new Date();
            let timestampVal = date.getTime();
            let msgObj = {
                conversationId: this.props.currentConversationRef.conversationId,
                from: this.props.loggedInUser._id,
                message: this.state.message,
                timestamp: timestampVal,
                to: this.props.selectedReceiver._id
            }
            this.props.dispatch(firebaseActions.sendMessage(msgObj));
            this.setState({message: ''});
        }
    };

    render() {
        if(this.props.fetchUserLoading) {
            return(
                <div className="row App hv-center">
                    <CircularProgress />
                </div>
            )
        } else {
            return(
                <div className="row chat-main-container hv-center">
                    {/* <h3>Let's chat .......</h3> */}
                    <div className="col-sm-9 chat-col">
                        <div className="row full-height double-border">
                            <div className="col-sm-4 user-container no-padding">
                                <div className="chat-user-list-container hv-center">
                                    <span>Users</span>
                                </div>
                                <ul className="user-list">
                                    {Object.keys(this.props.userList).map((key)=>{
                                      return(
                                        <li className="user-list-box" key={key} onClick={this.selectUserForChat.bind(this, this.props.userList[key])}>
                                            <img className="dp" src={this.props.userList[key].picture} alt=""/>
                                            <span>{this.props.userList[key].name}</span>
                                            <span className="user-status">{this.props.userList[key].status}</span>
                                        </li>
                                    )  
                                    })}
                                </ul>
                            </div>
                            <div className="col-sm-8 no-padding full-height">
                                <div className="msg-heading-container hv-center">Messages.......</div>
                                <div className={this.props.messageLoading ? 'hidden': 'msg-container visible'}>
                                    <div className="msg-list-container" id="msgListContainer">
                                        {Object.keys(this.props.currentConversationMessages).map(key=>{
                                            if(this.props.currentConversationMessages[key].message) {
                                                return(
                                                    <div className={this.props.loggedInUser._id === this.props.currentConversationMessages[key].from ? 'msg-detail msg-bg-right row no-margin': 'msg-detail msg-bg-left no-margin'} key={key}>
                                                        <div className="full-width pull-left">{this.props.currentConversationMessages[key].from === this.props.loggedInUser._id ? 'You': ''+this.props.selectedReceiver.name}</div>
                                                        <div className="full-width message-text">{this.props.currentConversationMessages[key].message}</div>
                                                        <div className="full-width pull-right">{this.props.currentConversationMessages[key].timestamp}</div>
                                                    </div>
                                                )
                                            }
                                        })}
                                        {/* {Object.keys(this.props.allConversationMessages[this.props.currentConversationRef.conversationId]).map(key=>{
                                            console.log('loop', key);
                                            if(this.props.currentConversationRef.conversationId === key){
                                                return(
                                                    <div className={this.props.loggedInUser._id === this.props.allConversationMessages[key].from ? 'msg-detail-right row full-width no-margin': 'msg-detail-left full-width no-margin'} key={key}>
                                                        <div className="full-width pull-left">{this.props.currentConversationMessages[key].from === this.props.loggedInUser._id ? 'You': ''+this.state.selectedReceiver.name}</div>
                                                        <div className="full-width message-text">{this.props.currentConversationMessages[key].message}</div>
                                                        <div className="full-width pull-right">{this.props.currentConversationMessages[key].timestamp}</div>
                                                    </div>
                                                )
                                            }
                                        })} */}
                                    </div>
                                    <div className="msg-footer v-center">
                                        <span className="msg-box"><TextField fullWidth id="msg"  label="Enter Your Message" margin="dense" onKeyDown={this.handleKeyPress.bind(this)} onChange={this.setInputValue.bind(this)} value={this.state.message ? this.state.message: ''}/> <br/></span>
                                        <span className="send-btn"><Button variant="raised" color="primary" className="" onClick={this.sendMessage.bind(this)}>
                                            Send
                                        </Button></span>
                                    </div>
                                </div>
                                <div className={this.props.messageLoading ? 'msg-loading-container visible': 'hidden'}>
                                    <div className="row full-height hv-center">
                                        <CircularProgress />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {

    return {
        loggedInUser: state.userStates.loggedInUser,
        fetchUserLoading: state.firebaseStates.fetchUserLoading,
        userList: state.firebaseStates.userList,
        isFbInitialized: state.firebaseStates.isFbInitialized,
        currentConversationRef: state.firebaseStates.currentConversationRef,
        myConversations: state.firebaseStates.myConversations,
        messageLoading: state.firebaseStates.messageLoading,
        currentConversationMessages: state.firebaseStates.currentConversationMessages,
        dbRef: state.firebaseStates.dbRef,
        allConversationMessages: state.firebaseStates.allConversationMessages,
        selectedReceiver: state.firebaseStates.selectedReceiver
    }
}

function mapDispatchToProps(dispatch) {

    let actions = bindActionCreators({ firebaseActions });
    return { ...actions, dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);