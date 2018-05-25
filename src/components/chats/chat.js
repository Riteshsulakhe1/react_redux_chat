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
            selectedReceiver: {},
            currentConvId : '',
            message: ''
        }
    }
    componentWillMount() {
        if(this.props.isFbInitialized) {
            this.props.dispatch(firebaseActions.getUserList());
        }
    }

    selectUserForChat (user) {
        if(user && this.state.selectedReceiver._id !== user._id) {
            this.setState({selectedReceiver: user});
            this.props.dispatch(firebaseActions.checkConversation(this.props.loggedInUser._id, user._id));
        }
    };
    setInputValue(event) {
     
        if(event.target) {
          this.setState({message: event.target.value});
        }
    }

    sendMessage () {

        if(this.state.message) {
            let date = new Date();
            let timestampVal = date.getTime();
            let msgObj = {
                conversationId: this.props.currentConversationRef.conversationId,
                from: this.props.currentConversationRef.from,
                message: this.state.message,
                timestamp: timestampVal,
                to: this.props.currentConversationRef.to
            }
            console.log('msg obj', msgObj);
            this.props.dispatch(firebaseActions.sendMessage(msgObj));
        }
    };
    componentWillReceiveProps(){
        if(this.props) {
            console.log('props received....', this.props)
            // this.fetchMsgOfCurrentConversation();
        }
    }

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
                                    <div className="msg-list-container">
                                        {Object.keys(this.props.currentConversationMessages).map(key=>{
                                            if(this.props.currentConversationMessages[key].message) {
                                                return(
                                                    <div className={this.props.loggedInUser._id === this.props.currentConversationMessages[key].from ? 'msg-detail-right row full-width no-margin': 'msg-detail-left full-width no-margin'} key={key}>
                                                        <div className="full-width pull-left">{this.props.currentConversationMessages[key].from === this.props.loggedInUser._id ? 'You': ''+this.state.selectedReceiver.name}</div>
                                                        <div className="full-width message-text">{this.props.currentConversationMessages[key].message}</div>
                                                        <div className="full-width pull-right">{this.props.currentConversationMessages[key].timestamp}</div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                    <div className="msg-footer v-center">
                                        <span className="msg-box"><TextField fullWidth id="msg"  label="Enter Your Message" margin="dense" onChange={this.setInputValue.bind(this)} value={this.state.message ? this.state.message: ''}/> <br/></span>
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
   console.log('state in chat', state.firebaseStates);
    return {
        loggedInUser: state.userStates.loggedInUser,
        fetchUserLoading: state.firebaseStates.fetchUserLoading,
        userList: state.firebaseStates.userList,
        isFbInitialized: state.firebaseStates.isFbInitialized,
        currentConversationRef: state.firebaseStates.currentConversationRef,
        messageLoading: state.firebaseStates.messageLoading,
        currentConversationMessages: state.firebaseStates.currentConversationMessages
    }
}

function mapDispatchToProps(dispatch) {

    let actions = bindActionCreators({ firebaseActions });
    return { ...actions, dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);