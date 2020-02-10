
// Import the "wrap" function
import { wrap } from 'svelte-spa-router'

// Components
import Home from './routes/Home.svelte'
import Login from './routes/Login.svelte'
import Register from './routes/Register.svelte'
import NotFound from './routes/NotFound.svelte'
import UserProfile from './routes/user/Profile.svelte'
import Quote from './routes/Quote.svelte'
import Privacy from './routes/Privacy.svelte'
import Contact from './routes/Contact.svelte'
import Forgot from './routes/Forgot.svelte'
import Reset from './routes/Reset.svelte'
import AdminPanel from './routes/admin/Panel.svelte'
import userStore from './stores/user-store.js'
import jwt_decode from 'jwt-decode'
import ls from 'local-storage'
import * as api from './helpers/api'
import {replace} from 'svelte-spa-router'
import {Toast} from './helpers/toast'

/* This will resfresh user data on the userStore only on browser reload */
const token = ls.get('jwt');
if (token) {
    const decoded = jwt_decode(token)
    const userId = decoded.id;
    (async () => {
        const res = await api.get(`users/${userId}`, token)
        if (res && res.errors) {
            ls.remove('jwt')
            replace('/')
        }
        return userStore.setUser(res.user)
    })().catch(err => {
        new Toast({
            message: err,
            type: "success"
        });
        //remove token incase server error and login route will be accesible 
        ls.remove('jwt')
        replace('/')
    });
}


// This demonstrates how to pass routes as a POJO (Plain Old JavaScript Object)
let routes


// The simples way to define routes is to use a dictionary.
// This is a key->value pair in which the key is a string of the path.
// The path is passed to regexparam that does some transformations allowing the use of params and wildcards
routes = {
    // Exact path
    '/': Home,
    // Allow children to also signal link activation
    '/brand': Home,
    '/login': wrap(
        Login,
        (detai) => {
            if (ls.get('jwt')) {
                return false
            }
            return true
        },
    ),
    '/register': wrap(
        Register,
        (detail) => {
            if (ls.get('jwt')) {
                return false
            }
            return true
        }
    ),
    '/user/profile': wrap(
        UserProfile,
        (detail) => {
            if (ls.get('jwt')) {
                return true
            }
            return false
        }
    ),
    '/admin/panel': wrap(
        AdminPanel,
        (detail) => {
            if (ls.get('jwt')) {
                return true
            } else {
                return false
            }
        }
    ),
    '/quote': Quote,
    '/privacy': Privacy,
    '/contact': Contact,
    '/forgot': Forgot,
    '/reset/:resetToken': Reset,

    // Catch-all, must be last
    '*': NotFound,
}

export default routes
