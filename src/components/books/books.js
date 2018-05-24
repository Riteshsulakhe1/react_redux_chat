import React from 'react';
import {connect} from 'react-redux';
import {toggleBookIcon, toggleBookModal, addBook, updateBook, getAllBooks, setSelectedBook, toggleAddEditMode, manageBookLoading, toggleTostMsg, deleteBook, toggleBookConfirmModal } from '../../actions/books.js';
import {bindActionCreators} from 'redux';
import DateFilter from '../filter/date.filter';
import './books.css';
//Material dependencies
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog, {DialogActions,DialogContent,DialogContentText,DialogTitle} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';


class Books extends React.Component {

    constructor (props) {
        super();
        this.state = {
            bookDetail: {
                name: '',
                description: '',
                auther: '',
                ownerId: localStorage.getItem('token')
            }
        }
    }

    componentWillMount () {

        this.props.dispatch(getAllBooks());
    }

    componentWillUnmount() {

        this.props.dispatch(toggleBookIcon(false));
    }

    closeBookModal = ()=> {

        this.clearCurrentBook();
        this.props.dispatch(toggleBookModal(!this.props.openBookModal));
    }

    clearCurrentBook = ()=>{

        this.setState({bookDetail: {
            name: '',
            description: '',
            auther: '',
            ownerId: localStorage.getItem('token')}
        });
    }

    setInputValue(key, event) {
     
        if(event.target && key) {
          const bookObj = this.state.bookDetail;
          bookObj[key] = event.target.value
          this.setState({bookDetail: bookObj});
        }
    }

    selectBook (book) {

        if(book._id) {
            this.props.dispatch(toggleAddEditMode(true));
            this.props.dispatch(toggleBookModal(true));
            this.props.dispatch(setSelectedBook(book));
            this.setState({bookDetail: book});
        }
    }

    addUpdateBook () {
        if(this.props.isEditMode) {
            this.updateBook();
        } else {
            this.addBook();
        }
    }

    addBook = () => {
        this.props.dispatch(manageBookLoading(true));
        this.props.dispatch(addBook(this.state.bookDetail));
    }

    updateBook () {

        this.props.dispatch(manageBookLoading(true));
        this.props.dispatch(updateBook(this.state.bookDetail));
        setTimeout(()=>{
            this.clearCurrentBook();
        },3000);
    }

    openConfirmDeleteModal(book) {
        
        if(book && book._id) {
            this.props.dispatch(setSelectedBook(book));
            this.props.dispatch(toggleBookConfirmModal(true, 'Are you sure to delete this book?'));
        }
    }
    removeBook (book) {

        this.props.dispatch(manageBookLoading(true));
        let index = this.props.bookList.indexOf(book)
        this.props.dispatch(deleteBook(book, index));
        setTimeout(()=>{
            this.props.dispatch(toggleBookConfirmModal(false));
            this.props.dispatch(toggleTostMsg(false, ''));
        },4000);
    }
    modalOpening() {
        console.log('modal is opening .....')
    }

    render(){
        const {classes} = this.props;
        return(
            <div className="table-container">
                {/* <h2>Books container</h2> */}
                <table className="table table-hover user-table">
                    <thead className="custom-thead">
                    <tr className="custom-tr">
                        <th className="custom-th" width="20%">Name</th>
                        <th className="custom-th" width="40%">Description</th>                        
                        <th className="custom-th" width="15%">Auther</th>
                        <th className="custom-th" width="15%">Created At</th>
                        <th className="custom-th" width="10%">Action</th>
                    </tr>
                    </thead>
                    <tbody className="custom-tbody">
                        {this.props.bookList.map((book, index)=>{
                            return(
                                <tr key={book._id+'-'+index} className="tr-value">
                                    <td width="20%">{book.name}</td>
                                    <td width="40%">{book.description}</td>
                                    <td width="15%">{book.auther}</td>
                                    <td width="15%"><DateFilter date={book.created}/></td>                                    
                                    {/* <td width="15%">{book.created}</td> */}
                                    <td width="10%">
                                        <i className="glyphicon glyphicon-pencil icon-space cursor-pointer" onClick={this.selectBook.bind(this, book)}/>
                                        <i className="glyphicon glyphicon-trash cursor-pointer" onClick={this.openConfirmDeleteModal.bind(this, book)}/>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Dialog modal="false" onRendered={this.props.modalOpening} fullWidth open={this.props.openBookModal} className={classes.paperWidthSm} aria-labelledby="form-dialog-title">
                    <div className="modal-header-container">
                    <DialogTitle id="form-dialog-title">
                        <span>
                            {this.props.isEditMode ? 'Update Book' : 'Add Book'}
                        </span>
                    </DialogTitle>
                    <span  className={this.props.isEditMode ? 'hide':'clear-btn cursor-pointer'}><Button color="secondary" className={classes.button} onClick={this.clearCurrentBook.bind(this)}>Clear</Button></span>
                    </div>
                    <DialogContent>
                        <DialogContentText>
                            Here you can add or update your book
                        </DialogContentText>
                        <TextField fullWidth id="book-name" style={styles.textField} label="Enter Book Name" margin="dense" onChange={this.setInputValue.bind(this, 'name')} value={this.state.bookDetail.name ? this.state.bookDetail.name: ''}/> <br/>
                        <TextField fullWidth id="book-description" style={styles.textField} multiline rows={2} margin="dense" rowsMax={4} label="Enter Book Description" onChange={this.setInputValue.bind(this, 'description')} value={this.state.bookDetail.description ? this.state.bookDetail.description: ''}/><br/>
                        <TextField fullWidth id="book-auther" style={styles.textField} label="Enter Book Auther" margin="dense" onChange={this.setInputValue.bind(this, 'auther')} value={this.state.bookDetail.auther ? this.state.bookDetail.auther: ''}/>
                    </DialogContent>
                    <DialogActions>
                        <div className={this.props.addUpdateLoading ? "visible": "hidden"}>
                            <CircularProgress />
                        </div>
                        <Button onClick={this.closeBookModal.bind(this)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addUpdateBook.bind(this)} color="primary">
                            {this.props.isEditMode?'Update': 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

Books.propTypes = {
    classes: PropTypes.object.isRequired,
};
const styles = theme => ({
    textField: {
        fontSize: 20
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
      },
      table: {
        minWidth: 700,
      },
      row: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
});

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

    let actions = bindActionCreators({ toggleBookIcon, toggleBookModal, addBook, updateBook, getAllBooks, setSelectedBook, toggleAddEditMode, manageBookLoading, toggleTostMsg, deleteBook });
    return { ...actions, dispatch };
}  

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Books));