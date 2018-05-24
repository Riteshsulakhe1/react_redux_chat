import React from 'react';
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {connect} from 'react-redux';
import {toggleTostMsg} from '../../actions/books.js';
import {bindActionCreators} from 'redux';
import * as Auth from '../../actions/authentication.js';
//Material dependencies
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';
import './App.css';


const history = createHistory();
class Register extends React.Component {
    constructor(){
      super();
      this.state = {
        register: {
          name: '',
          email: '',
          mobile: '',
          password:''
        }
      }
    }  
    
    componentWillMount () {
      console.log('auth', Auth);
      console.log('props', this.props);
      // if(localStorage.getItem('token')) {
      //     this.props.history.push('/users');
      // }
    }
  
    setInputValue(key, event) {
     
      if(event.target && key) {
        const regObj = this.state.register;
        regObj[key] = event.target.value
        this.setState({register: regObj});
      }
    }
    signUp () {

      let request = this.props.dispatch(Auth.register(this.state.register));
      request.then((res)=>{
        res.json().then((savedUser)=>{
          console.log('saved user', savedUser);
          if(!savedUser.status) {
            localStorage.setItem('token', savedUser._id);
            this.props.dispatch(Auth.setLoggedInUser(savedUser));
            this.props.history.push('/books');
          }
        });
      }).catch((err)=>{
        console.log('err', err);
      });
    }
  
    render(){
      return(
        <div className="row App hv-center">
          <h2>Registration Form</h2>
          <div className="col-sm-4 panel">
            <TextField fullWidth id="name" style={styles.textField} label="Enter Name" margin="dense" onChange={this.setInputValue.bind(this, 'name')} value={this.state.register.name}/> <br/>
            <TextField fullWidth id="email" style={styles.textField} label="Enter Email" margin="dense"  onChange={this.setInputValue.bind(this, 'email')} value={this.state.register.email}/> <br/>
            <TextField fullWidth id="mobile" style={styles.textField} label="Enter Mobile" margin="dense" onChange={this.setInputValue.bind(this, 'mobile')} value={this.state.register.mobile}/> <br/>
            <TextField fullWidth type="password" id="password" style={styles.textField} label="Enter Password" margin="dense" onChange={this.setInputValue.bind(this, 'password')} value={this.state.register.password}/> <br/>
            <div className="row reg-btn-container">
              <span className='pull-left'>Already a member?, Try <Link to="/signIn">Log In</Link></span>
              <Button className="sign-up-btn" variant="raised" onClick={this.signUp.bind(this)} color="primary" autoFocus>
                Sign Up
              </Button>
              {/* <button className="btn btn-primary reg-btn" onClick={this.signUp.bind(this)}>Sign Up</button> */}
              
            </div>
            
          </div>
        </div>
      )
    }
}
const styles = {

}

function mapStateToProps(state) {

  return {
    loggedInUser: state.userStates.loggedInUser,
    showAddBook: state.bookStates.showAddBook,
    openBookModal: state.bookStates.openBookModal,
    bookList: state.bookStates.bookList,
    selectedBook: state.bookStates.selectedBook,
    isEditMode: state.bookStates.isEditMode,
    addUpdateLoading: state.bookStates.addUpdateLoading

  }
}
function mapDispatchToProps(dispatch) {

  let actions = bindActionCreators({toggleTostMsg, Auth });
  return { ...actions, dispatch };
}  

export default connect(mapStateToProps, mapDispatchToProps)(Register);