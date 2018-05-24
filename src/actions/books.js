import * as apiUrlConstants from '../constants/apiUrl.constant.js';

export function toggleBookIcon (status) {

    return { type:'TOGGLE_BOOK_ADD_ICON', payload: {showAddBook:status}};
}

export function toggleBookModal (status, editMode) {

    if(status === true && editMode && editMode === true) {
        return { type: 'TOGGLE_BOOK_MODAL', payload: {openBookModal: status, isEditMode: false, selectedBook:{}}};
    } else {
        return { type: 'TOGGLE_BOOK_MODAL', payload: {openBookModal: status}};
    }
}

export function toggleBookConfirmModal (status, msg) {

    return { type: 'TOGGLE_BOOK_CONFIRM_MODAL', payload: {openBookConfirmModal: status, confirmationMsg:msg}};
}

export function toggleTostMsg (status, msg) {

    return { type: 'TOGGLE_TOST_MSG', payload: {isTostOpen: status, tostMessage: msg}};
}

export function addBook (book) {
    return dispatch =>{
        const url = apiUrlConstants.BASE_URL+'/book';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(book),
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then(response =>{
            response.json().then(book=>{
                dispatch(addBookInArray(book));
                setTimeout(()=>{
                    dispatch(manageBookLoading(false));
                    dispatch(toggleTostMsg(true, 'Book Added Successfully'));
                },500);
                setTimeout(()=>{
                    dispatch(toggleTostMsg(false, ''));
                },3000);
            })
        })    
        .catch(error => dispatch(addBookError(error)));
    }
}

export function updateBook (book) {

    return dispatch =>{
        const url = apiUrlConstants.BASE_URL+'/book';
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(book),
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then(response =>{
            response.json().then(updatedBook=>{
                dispatch(updateBookArray(book, updatedBook));
                setTimeout(()=>{
                    dispatch(manageBookLoading(false));
                    dispatch(toggleBookModal(false));
                    dispatch(toggleTostMsg(true, 'Book Updated Successfully'));
                },1000);
                setTimeout(()=>{
                    dispatch(toggleTostMsg(false, ''));
                },3000);
            })
        })    
        .catch(error => dispatch(addBookError(error)));
    }
}

export function deleteBook (book, bookIndex) {
    return dispatch =>{
        const url = apiUrlConstants.BASE_URL+'/book';
        fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(book),
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then(response =>{
            response.json().then(book=>{
                dispatch(removeBookFromList(bookIndex));
                setTimeout(() => {
                    dispatch(manageBookLoading(false));
                    dispatch(toggleBookConfirmModal(false, ''))
                    dispatch(toggleTostMsg(true, 'Book Deleted Successfully'));
                }, 1500);
                setTimeout(()=>{
                    dispatch(toggleTostMsg(false, ''));
                },3000);
            })
        })    
        .catch(error => dispatch(addBookError(error)));
    }
}

export function manageBookLoading (status) {

    return {type: 'FECTH_BOOK_START', payload: {addUpdateLoading: status}};
}

export function addBookError () {

    return {type: 'ADD_BOOK_ERROR', payload: {addBookError: true, addUpdateLoading: false}};
}

export function getAllBooks () {

    let userId = localStorage.getItem('token');
    return dispatch =>{
        dispatch(listBookLoading());
        const url = apiUrlConstants.BASE_URL+'/booksByUserId/?ownerId='+userId;
        fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then(response =>{
            response.json().then(books=>{
                dispatch(setBookArray(books));
                dispatch(listBookLoading());
            })
        })    
        .catch(error => dispatch(listBookError(error)));
    }
}

export function setBookArray (bookList) {

    return { type: 'SET_BOOK_LIST', payload: {bookList: bookList, listBookError: false}};
}

export function addBookInArray (book) {

    return{ type: 'ADD_BOOK_IN_LIST', payload: {book: book}};
}

export function updateBookArray (oldBook, updatedBook) {

    return { type: 'UPDATE_BOOK_LIST', payload: {oldBook: oldBook, updatedBook: updatedBook}};
}

export function listBookLoading (status) {

    return {type: 'LIST_BOOK_LOADING', payload: {bookListLoading: status}};
}

export function listBookError () {

    return {type: 'LIST_BOOK_ERROR', payload: {listBookError: true, bookListLoading: false}}
}

export function setSelectedBook(book) {

    return { type: 'SELECT_BOOK', payload: {selectedBook: book}};
}

export function toggleAddEditMode (status) {

    return {type: 'TOGGLE_ADD_EDIT_MODE', payload:{isEditMode: status}};
}

export function clearCurrentBook () {

    return { type: 'CLEAR_BOOK_DETAILS', payload: {selectedBook: {}}};
}

export function removeBookFromList (index) {

    return { type: 'DELETE_BOOK', payload: {bookIndex: index}}
}