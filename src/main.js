import App from "./App.svelte";
import * as api from './helpers/api.js';
import userStore from './stores/user-store.js';
import ls from 'local-storage';
import jwt_decode from 'jwt-decode';
import {replace} from 'svelte-spa-router';

const app = new App({
  target: document.body,
});

let userId;
let token = ls.get('jwt');

if (token) {
  const decoded = jwt_decode(token);
  userId = decoded.id;  

  (async () => {
    const res = await api.get(`users/${userId}`, token);
    if (res && res.errors) {
      ls.remove('jwt');
      replace('/');
    } else {
      userStore.setUser(res.user);
    }
  })().catch(err => {
    console.error(err);
  });
}

export default app;
