import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';
import './profile.css';
class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            userProfile:{}
        };
    }
    componentWillMount() {
        this.setState({userProfile: this.props.loggedInUser});
        console.log('userProfile', this.props.userProfile);
    }
    render() {
        const {classes} = this.props;
        return(
            <div className="row profile-container hv-center">
                <div className="col-sm-4 profile-col panel">
                    <TextField fullWidth id="name" style={styles.textField} label="Enter Your Name" margin="dense" value={this.state.userProfile.name} /> <br/>
                    <TextField fullWidth id="email" disabled style={styles.textField} label="Enter Your Email" margin="dense" value={this.state.userProfile.email} /> <br/>
                    <TextField fullWidth id="mobile" style={styles.textField} label="Enter Your Mobile" margin="dense" value={this.state.userProfile.mobile} /> <br/>
                    {/* <TextField fullWidth id="password" style={styles.textField} label="Enter Your Password" margin="dense" value={this.state.userProfile.name} /> <br/>
                    <TextField fullWidth id="confirmPassword" style={styles.textField} label="Enter Confirm Password" margin="dense" /> <br/> */}
                    <div className="btn-container">
                        <CircularProgress className={this.props.addUpdateLoading ? "visible": "hidden"} />
                        <Button onClick={this.closeBookModal} color="primary">
                            Cancel
                        </Button>
                        <Button variant="raised" color="secondary" className={classes.button} onClick={this.addUpdateBook}>
                            Update
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};
const styles = theme => ({
    textField: {
        fontSize: 20
    }
});
function mapStateToProps (state) {
    console.log('state in profile', state);
    return {
        loggedInUser: state.userStates.loggedInUser

    }
}
export default withStyles(styles)(connect(mapStateToProps,null)(Profile));