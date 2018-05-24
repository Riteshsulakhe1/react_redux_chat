import {Promise} from 'react';
export function register(registerData) {
    const url = 'http://localhost:4000/saveUser';
    return new Promise((reject, resolve)=>{
        fetch(url, {
            method: 'POST',
            headers: new Headers({
            'Content-Type': 'application/json'
            }),
            body: JSON.stringify(registerData)
        }).then((res)=>{
            resolve(res.json());
        }).catch((err)=>{
            reject(err);
        })
    })
    
};