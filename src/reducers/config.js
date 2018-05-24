const initial = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
}

export function ConfigReducer (state = initial, action) {

    switch (action.type) 
    {
        case "SET_FIREBASE_CONFIGS":
        {
            state = Object.assign({}, state, action.payload)
            break;
        }
        default :return state;
    }
    return state;
};