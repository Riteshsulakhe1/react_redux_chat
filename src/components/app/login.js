import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {getLoggedInUser} from '../../actions/user.js';
import {registerGoogleUser, getGoogleUser, setLoggedInUser, login} from '../../actions/authentication.js';
import { getConfigs } from '../../actions/config.js';
import {bindActionCreators} from 'redux';
import * as fireBaseActions from '../../actions/firebase.js';
import GoogleButton from 'react-google-button';
//Material dependencies
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import './login.css';
class Login extends React.Component {
    constructor(props){
        super(props);
        this.state ={
          login: 
          {
            email: '',
            password: ''
          }
        }
      }
    componentWillMount () 
    {
        if(localStorage.getItem('token')) {
            this.props.history.push('/users');
        }
    };

    setInputValue(key , event) {

        if(key && event.target) {
            const loginObj = this.state.login;
            loginObj[key] = event.target.value;
            this.setState({login: loginObj});
        }
    };

    gotoLogin () {
        let loginReq = this.props.dispatch(login(this.state.login))
        loginReq.then((res)=>{
            res.json().then((user)=>{
                if(!user.message){
                    console.log('logged in user', user);
                    localStorage.setItem('token', user._id);
                    this.props.dispatch(getLoggedInUser(user._id));
                    this.props.dispatch(getConfigs(user._id));
                    this.props.history.push('/users');
                    
                }
            })
        }).catch((err)=>{
            console.log('err', err);
        })
    };

    loginWithGoogle () {

        let auth = fireBaseActions.Authenticate();
        auth.then((user)=>{
            console.log('I m logged In with Google .....',user);
            let profile =  user.additionalUserInfo.profile;
            let userDetail = {
                name: profile.name,
                email: profile.email,
                picture: profile.picture,
                signInWithGoogle: true,
                mobile: user.user.phoneNumber
            }
            if(user.additionalUserInfo.isNewUser) {
                this.saveNewGoogleUser(userDetail);
            } else {
                this.updateUserStatusOnline(userDetail);
            }
        });
    };

    saveNewGoogleUser (user) {

        if(user && user.email) {
            let registerReq = this.props.dispatch(registerGoogleUser(user));
            registerReq.then((savedUser)=>{
                savedUser.json().then((user)=>{
                    fireBaseActions.addUserToDb(user);
                    this.afterLoginSuccess(user);                
                });
            },(err)=>{
                console.log('err in saveNewGoogleUser', err);
            });
        }
    }
    
    updateUserStatusOnline (user) {

        let userReq = this.props.dispatch(getGoogleUser(user));
        userReq.then((savedUser)=>{
            savedUser.json().then((user)=>{
                fireBaseActions.updateUserStatusOnline(user);
                this.afterLoginSuccess(user);
            })
        },(err)=>{
            console.log('err in saveNewGoogleUser', err);
        }); 
    };

    afterLoginSuccess (user) {
        localStorage.setItem('token', user._id);
        this.props.dispatch(setLoggedInUser(user));
        this.props.history.push('/users');
    };

    render() {
        return(
            <div className="row App hv-center">
            <h2>Login Form</h2>
            <div className="col-sm-4 panel login-form-container">
                <form>
                <TextField className="login-credential" fullWidth id="email" style={styles.textField} label="Enter Email" margin="dense" onChange={this.setInputValue.bind(this, 'email')} value={this.state.login.email ? this.state.login.email: ''}/> <br/>
                <TextField className="login-credential" fullWidth id="name" type="password" style={styles.textField} label="Enter Password" margin="dense" onChange={this.setInputValue.bind(this, 'password')} value={this.state.login.password ? this.state.login.password: ''}/> <br/>
                <div className="row h-center login_btn_container">
                    <Button className="login_btn" variant="raised" onClick={this.gotoLogin.bind(this)} color="primary" autoFocus>
                        Login
                    </Button>
                </div>
                <div className="row h-center">
                    <GoogleButton
                        onClick={this.loginWithGoogle.bind(this)}
                    />
                </div>
                <div className="row text-center">
                    <h4>
                        <span>Do not have account?, Try <Link to="/signUp">Sign Up</Link></span>
                    </h4>
                </div>
                </form>
            </div>
        </div>
        )
    }
}
const styles = theme=>({

});
function mapStateToProps (state) {
    return {
        loggedInUser: state.userStates.loggedInUser
    }
}
function mapDispatchToProps (dispatch) {

    let actions = bindActionCreators({ getLoggedInUser, getConfigs, registerGoogleUser, getGoogleUser, setLoggedInUser, fireBaseActions, login });
    return { ...actions, dispatch };
}
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Login));
