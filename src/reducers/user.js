const initialState = {
    showUserLoading: false,
    fetchUserError: null,
    userList: [],
    selectedUser:{},
    loggedInUser: {},
    loginLoading: false
}
export function userListReducer (state = initialState, action){

    switch(action.type) {

        case "FETCH_USER_START": 
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "FETCH_USER_COMPLETED": 
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "FETCH_USER_ERROR": 
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "UPDATE_USER_LIST":
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "SELECT_USER":
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "LOGGED_IN_USER":
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "CLEAR_SELECTED_USER": 
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "LOGOUT":
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        case "AUTHENTICATE_USER": 
        {
            state = Object.assign({}, state, action.payload);
            break;
        }
        case "TOGGLE_NORMAL_LOADING":
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        default : return state;
    }
    return state;
}
