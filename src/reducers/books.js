const initial = {
    showAddBook: false,
    openBookModal: false,
    bookList: [],
    selectedBook: {},
    isEditMode: false,
    addUpdateLoading: false,
    addBookError: false,
    bookListLoading: false,
    listBookError: false,
    isTostOpen: false,
    tostMessage: '',
    openBookConfirmModal: false,
    confirmationMsg: ''
}

export function bookReducer (state = initial, action) {

    switch (action.type) {

        case 'TOGGLE_BOOK_ADD_ICON': 
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'TOGGLE_BOOK_MODAL':
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'TOGGLE_TOST_MSG':
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'FECTH_BOOK_START':
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'ADD_BOOK_ERROR':
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'SET_BOOK_LIST':
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'ADD_BOOK_IN_LIST':
        {
            let updatedBookList = state.bookList.concat(action.payload.book);
            state = Object.assign({}, state, {bookList: updatedBookList});
            break;
        }
        case 'UPDATE_BOOK_LIST':
        {
            let bookIndex = state.bookList.indexOf(action.payload.oldBook);
            if(bookIndex && bookIndex !== -1) {
                let books = state.bookList;
                books.splice(bookIndex, 1);
                books[bookIndex] = action.payload.updatedBook;
                state = Object.assign({}, state, {bookList: books});
            }
           
            break;
        }
        case 'LIST_BOOK_ERROR':
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'SELECT_BOOK': 
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'TOGGLE_ADD_EDIT_MODE': 
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'CLEAR_BOOK_DETAILS': 
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'DELETE_BOOK': 
        {
            let updatedBookList = state.bookList.splice(action.payload.bookIndex, 1);
            state = Object.assign({}, state, action.payload);
            break;
        }
        case 'TOGGLE_BOOK_CONFIRM_MODAL': 
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        
        default : return state;
    }
    return state;
}