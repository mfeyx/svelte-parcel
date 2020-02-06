import userStore from '../../src/stores/user-store';
import ls from 'local-storage';
import {replace} from 'svelte-spa-router'

let userId;
let token;

token = ls.get('jwt');

export async function checkAuth(url){

    await userStore.subscribe(userData => {
        userId = userData.id;
        if(userId && token){
            replace(`user/profile`);
        } else {
            replace(url);
        }

    });



}
