import React from 'react';
import {connect} from 'react-redux';
import {toggleBookConfirmModal, deleteBook, manageBookLoading} from '../../actions/books.js';
import {bindActionCreators} from 'redux';

//Material Dependencies
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {CircularProgress} from 'material-ui/Progress';


class ConfirmDialog extends React.Component {

    handleClose = () => {

        this.props.dispatch(toggleBookConfirmModal(false, ''));
    }

    confirmDelete = () =>{
        this.props.dispatch(manageBookLoading(true));
        const bookIndex = this.props.bookList.indexOf(this.props.selectedBook);
        this.props.dispatch(deleteBook(this.props.selectedBook, bookIndex));
    }

    render() {
        return(
            <Dialog
                open={this.props.openBookConfirmModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation Modal"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {this.props.confirmationMsg}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className={this.props.addUpdateLoading ? "visible": "hide"}>
                        <CircularProgress />
                    </div>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.confirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
const mapStateToProps = (state) =>{
    return {
        openBookConfirmModal: state.bookStates.openBookConfirmModal,
        confirmationMsg: state.bookStates.confirmationMsg,
        bookList: state.bookStates.bookList,
        selectedBook: state.bookStates.selectedBook,
        addUpdateLoading: state.bookStates.addUpdateLoading

    }
}
const mapDispatchToProps = (dispatch)=> {

    let actions = bindActionCreators({ toggleBookConfirmModal, deleteBook, manageBookLoading });
    return { ...actions, dispatch };
}  
export default(connect(mapStateToProps, mapDispatchToProps)(ConfirmDialog));

