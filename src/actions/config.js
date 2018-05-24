import * as apiUrlConstants from '../constants/apiUrl.constant.js';
export function getConfigs (userId) {

    return dispatchEvent =>{
        const url = apiUrlConstants.BASE_URL+'/credentials?_id='+localStorage.getItem('token');
        fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Content-Type': 'application/json'
            })
        }).then((response)=>{
            response.json().then((configs)=>{
               dispatchEvent( updateConfigs(configs));
            });
        }).catch((err)=>{
            console.log('err in get configs', err);
        });
    }
};
export function updateConfigs (configData) {

    return{ type: 'SET_FIREBASE_CONFIGS', payload: configData};
}