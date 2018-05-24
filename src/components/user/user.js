import React from 'react';
import {connect} from 'react-redux';
import {fetchUser, selectUser, clearSelectedUser} from '../../actions/user.js';
import {bindActionCreators} from 'redux';
import './user.css';
//Material dependencies
import {CircularProgress} from 'material-ui/Progress';

class User extends React.Component{
    constructor() {
        super();
        this.state = {
            user: {}
        }
    }
    componentDidMount () 
    {   
        if(localStorage.getItem('token')) {
            this.props.dispatch(fetchUser());
        } else {
            this.props.history.push('/');
        }   
    }
    setUserInputValue(key , event) 
    {
        if(key && event.target) {
          const userObj = this.state.user;
          userObj[key] = event.target.value;
          this.setState({user: userObj});
        }
      }
    selectUser (user) 
    {
        this.props.dispatch(selectUser(user));
    }

    deleteUser (user)
    {
        console.log('user for delete', user);
    }

    clearUserInput () 
    {
        if(this.props.selectedUser._id) {
            this.props.dispatch(clearSelectedUser())
        }
    }
  
    render(){
        if(!this.props.showFetchLoading) {
            return(
                <div className="row App hv-center">
                    <div className="row input-row">
                        <div className="form-group">
                            <input type="text" className="form-control editor" id="name" placeholder="Name" onChange={this.setUserInputValue.bind(this, 'name')} value={this.props.selectedUser._id ? this.props.selectedUser.name : this.state.user.name}/>
                        </div>
                        <div className="form-group">
                            <input type="text" id="email" className="form-control editor" placeholder="Email" onChange={this.setUserInputValue.bind(this, 'email')} value={this.props.selectedUser._id ? this.props.selectedUser.email : this.state.user.email}/>
                        </div>
                        <div className="form-group">
                            <input type="number" id="mobile" className="form-control editor" placeholder="Mobile" onChange={this.setUserInputValue.bind(this, 'mobile')} value={this.props.selectedUser._id ? this.props.selectedUser.mobile : this.state.user.mobile}/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success add-update-btn">{this.props.selectedUser._id ? 'Update': 'Add'}</button>
                            <button className="btn btn-danger" onClick={this.clearUserInput.bind(this)}>Clear</button>
                        </div>
                    </div>
                    <div className="col-sm-8 user-list-container">
                        {this.props.userList.map((user)=>{
                            return(
                                <div className="row panel" key={user._id}>
                                    <div className="col-sm-3">
                                        {user.name}
                                    </div>
                                    <div className="col-sm-3">
                                        {user.email}
                                    </div>
                                    <div className="col-sm-2">
                                        {user.mobile}
                                    </div>
                                    <div className="col-sm-2">
                                        <a  onClick={this.selectUser.bind(this, user)}>Edit</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a  onClick={this.deleteUser.bind(this, user)}>Delete</a>
                                    </div>
                                </div>
                            )
                        })}  
                    </div>
                </div>
            )
        } else {
            return(
                <div className="row App hv-center">
                    <CircularProgress />
                </div>
            )
        }
    }  
} 

function mapStateToProps(state) {
    
    return {

        showFetchLoading: state.userStates.showUserLoading,
        fetchUserError: state.userStates.fetchUserError,
        selectedUser: state.userStates.selectedUser,
        userList: state.userStates.userList,
        loggedInUser: state.userStates.loggedInUser
    }
}
function mapDispatchToProps(dispatch) {

    let actions = bindActionCreators({ fetchUser, selectUser, clearSelectedUser });
    return { ...actions, dispatch };
}  
export default connect(mapStateToProps, mapDispatchToProps)(User);