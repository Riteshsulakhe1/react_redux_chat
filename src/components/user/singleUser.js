import React from 'react';
import {connect} from 'react-redux';


class SingleUser extends React.Component{
    componentDidMount(){
        console.log('selected user is', this.props);
    }
    render(){
        return(
            <div className="">
               <h3>User detail of </h3>
               <ul>
                   <li>Name: {this.props.selectedUser.name}</li>
                   <li>Email: {this.props.selectedUser.email}</li>
                   <li>Date: {this.props.selectedUser.created}</li>
               </ul>
            </div>
        )
    }

}

function mapStateToProps (state) {
    return {
        selectedUser: state.userStates.selectedUser
    }
}
// function mapDispatchToProps(dispatch) {

//     let actions = bindActionCreators({ selectUser });
//     return { ...actions, dispatch };
// } 
export default connect(mapStateToProps)(SingleUser);