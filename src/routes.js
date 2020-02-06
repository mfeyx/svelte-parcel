
import Router from 'svelte-spa-router'
// Import the "wrap" function
import {wrap} from 'svelte-spa-router'

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
import userStore from "./stores/user-store.js"
import ls from 'local-storage'

let isAdmin;

userStore.subscribe(userData => {
    const currentUser = userData;  
    isAdmin = currentUser.role === "admin";
});

// This demonstrates how to pass routes as a POJO (Plain Old JavaScript Object) or a JS Map
// In this code sample we're using both (controlling at runtime what's enabled, by checking for the 'routemap=1' querystring parameter) just because we are using this code sample for tests too
// In your code, you'll likely want to choose one of the two options only
let routes
const urlParams = new URLSearchParams(window.location.search)
if (!urlParams.has('routemap')) {
    
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
               if(ls.get('jwt')){
                   return false
               }
               return true
            },            
        ),
        '/register': wrap(
            Register,
            (detail) =>{
                if(ls.get('jwt')){
                    return false
                }
                return true
            }
        ),
        '/user/profile': wrap(
            UserProfile,
            (detail) => {
                if(ls.get('jwt')){
                    return true
                }
                return false
            }
        ),
        '/admin/panel': wrap(
            AdminPanel,
            (detail) => {
                if(ls.get('jwt') && isAdmin){
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
}

export default routes
