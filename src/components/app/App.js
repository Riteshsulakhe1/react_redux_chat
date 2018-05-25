import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import './App.css';
import {toggleBookIcon, toggleBookModal, toggleTostMsg} from '../../actions/books.js';
import {bindActionCreators} from 'redux';
import {logout} from '../../actions/user';
import ConfirmDialog from './confirmDialogModal';
import * as fireBaseActions from '../../actions/firebase.js';

//Material dependencies
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Snackbar from 'material-ui/Snackbar';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }
  componentWillMount () 
  {
    if(localStorage.getItem('token')) {
      this.props.history.push('/users');
      this.props.dispatch(toggleBookIcon(false))
    }
  }

  handleToggle = (status) => {

    this.setState({open: !this.state.open});
  }

  toggleBookIcon = (status) =>{

    this.props.dispatch(toggleBookIcon(status));
  }

  toggleBookModal = ()=>{

    this.props.dispatch(toggleBookModal(!this.props.openBookModal, this.props.isEditMode /*for addEdite mode */))
  }

  logout () {

    fireBaseActions.logOut(this.props.loggedInUser).then((user)=>{
      localStorage.removeItem('token');
      this.props.dispatch(logout());
      this.props.history.push('/signIn');
      console.log('logout from google successfully...........', user);
    });
    
  }
  handleClose () {

  }
  render() {
    const { classes } = this.props;
    // const green = '#26b099';
    // const black = 'black';
    
    const sideList = (
      <div className={classes.list}>
        <List className="icon-container">
          <i className="glyphicon glyphicon-remove pull-right" onClick={this.handleToggle.bind(this,true)}></i>
        </List>
        <List>
          <Link to="/books" onClick={this.toggleBookIcon.bind(this, true)}>
            Books
          </Link>
        </List>
        <List>
          <Link to="/users" onClick={this.toggleBookIcon.bind(this, false)}>
            Manage Users
          </Link>
        </List>
        <List>
          <Link to="/user/chats">
            Chats
          </Link>
        </List>
        <List>
          <Link to="/user/profile" onClick={this.toggleBookIcon.bind(this, false)}>
            Profile
          </Link>
        </List>
      </div>
    );
    return (
        <div className="row" style={styles.app_main_container}>
          <AppBar position="static">
            <Toolbar>
            <IconButton className={classes.menuButton} onClick={this.handleToggle.bind(this)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
              <div className="col-sm-4 v-center">
                <span className="heading-2 nav-title">Welcome</span>
              </div>
              <div className="col-sm-8 right-col-container">
                <span className={this.props.loggedInUser._id ? 'hidden': 'pull-right'}>
                <Link to="/signUp"> <button className="btn btn-primary btns reg-btn">Register</button></Link>
                <Link to="/signIn"><button className="btn btn-success btns login-btn">Login</button></Link>
                </span>
                <img  className={this.props.loggedInUser._id && this.props.loggedInUser.picture? 'visible profile-pic': 'hidden'} src={this.props.loggedInUser.picture} />
                <img  className={this.props.loggedInUser._id && !this.props.loggedInUser.picture? 'visible profile-pic cursor-pointer': 'hidden'} src="images/account_circle_black_48x48.png" />                
                <div className={this.props.loggedInUser._id? 'logout-btn full-height v-center': 'hidden'}>
                <Button variant="raised" color="secondary" className={classes.button} onClick={this.logout.bind(this)}>
                  Logout
                </Button>
                </div>
                <div className={this.props.showAddBook ? 'visible add-book-btn': 'hidden'}>
                  <Button variant="fab" mini color="default" aria-label="add" className={classes.button} onClick={this.toggleBookModal}>
                    <AddIcon />
                  </Button>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          {/* <h2>Main container</h2> */}
          <Drawer open={this.state.open}>
            <div tabIndex={0} role="button" onClick={this.handleToggle.bind(this,true)} onKeyDown={this.handleToggle.bind(this)}>
              {sideList}
            </div>
        </Drawer>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={this.props.isTostOpen}
          onClose={this.handleClose}
          contentprops={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.props.tostMessage}</span>}
        />
        <ConfirmDialog/>

      </div>
    );
  }
}

const styles = theme=>({
  app_main_container:{
    height: '100% !important',
    overflowY:'hidden',
    overflowX: 'hidden'
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  button: {
    margin: theme.spacing.unit,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

function mapStateToProps(state) {

  return {

    userList: state.userStates.userList,
    loggedInUser: state.userStates.loggedInUser,
    showAddBook: state.bookStates.showAddBook,
    openBookModal: state.bookStates.openBookModal,
    isTostOpen: state.bookStates.isTostOpen,
    tostMessage: state.bookStates.tostMessage,
    isEditMode: state.bookStates.isEditMode,

  }
}

function mapDispatchToProps(dispatch) {

  let actions = bindActionCreators({ toggleBookIcon, toggleBookModal ,toggleTostMsg, fireBaseActions});
  return { ...actions, dispatch };
}  

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
// export default connect(mapStateToProps, mapDispatchToProps)(App);
