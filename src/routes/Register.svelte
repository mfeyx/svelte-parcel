<script context="module">
    import ls from 'local-storage';
    import Router from 'svelte-spa-router'
    import { GoogleAuth } from '@beyonk/svelte-social-auth'

    let token = ls.get('jwt');
    export async function preload({ params }, { user }) {
        if(token){
            this.redirect(302, `/`);
        }
    }
</script>

<script>
    import Register from "../components/User/Register.svelte";

    function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;  
      }

</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<div class="column is-8 is-offset-2">
    <div class="card la-card">
        <div class="card-content clearfix">
            <h2 class="la-headline">SIGN UP</h2>
            <p class="is-centered">We're happy you're here!</p>

            <!-- <div class="center-btn">
                <div class="g-signin2" data-onsuccess="onSignIn" data-theme="white"></div>
            </div> -->
<!-- 
            <div class="is-centered">
                <a title="Log in with Google" class="button is-center la-google-btn" href="/">
                    <span class="jui-icon-icon jui-buttonSocialConnect-buttonSocialConnectIcon jui-buttonSocialConnect-buttonSocialConnectIconGoogle">
                        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <g fill="#000" fill-rule="evenodd">
                            <path d="M10 4.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C14.46 1.89 12.43 1 10 1 6.48 1 3.44 3.02 1.96 5.96l2.91 2.26C5.6 6.05 7.62 4.48 10 4.48z" fill="#EA4335"></path>
                            <path d="M18.64 10.2c0-.74-.06-1.28-.19-1.84H10v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path>
                            <path d="M4.88 11.78a5.54 5.54 0 0 1-.3-1.78c0-.62.11-1.22.29-1.78L1.96 5.96A9.008 9.008 0 0 0 1 10c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path>
                            <path d="M10 19c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74l-2.91 2.26C3.45 16.98 6.48 19 10 19z" fill="#34A853"></path>
                            <path fill="none" d="M1 1h18v18H1z"></path>
                        </g>
                        </svg>
                    </span>
                    <span class="ua-button-text jui-buttonSocialConnect-buttonSocialConnectText">Log in with Google</span>
                </a>
            </div> -->

            <div class="la-divider">
                <hr class="la-divider-left">
                <p class="la-divider-text">
                    &nbsp;
                </p>
                <hr class="ua-divider-right">
            </div>
            <Register/>
            <p>By creating an account you agree to our <a href="#/privacy">privacy policy</a></p>
        </div>
        <footer class="card-footer">
            <a href="#/login" class="card-footer-item">Already have an account?</a>
        </footer>
    </div>
</div>

<style>
    .center-btn{
        width: 120px;
        margin: auto;
        display: block;
    }
    .card-footer{
        background: #00818b;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .card-footer a{
        color: white;
    }
    .la-divider{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: "Brandon Text","Asap",Verdana,Arial,sans-serif;
        color: #5c5c5c;
        font-weight: bold;
        width: 90%;
        margin: 0 auto;
    }
    .la-divider hr{
        flex-grow: 3;
        height: 2px;
        border: none;
        background-color: #f2f2f2;
    }
    .la-divider .la-divider-text{
        flex-grow: 1;
        text-align: center;
    }
    .is-centered{
        margin: 20px 0;
        text-align: center;
    }
    .la-google-btn{
        border: 2px solid #e6e7f0;
        line-height: 1;
    }
    .la-google-btn span{
        margin-right: 30px;
    }
    .la-card{
        border-radius: 4px;
        box-shadow: 0 4px 16px 0 rgba(0,0,0,0.16);
    }
    .la-headline{
        font-weight: bold;
        text-align: center;
        font-size: 30px;
        color: #00828C;
        margin-bottom: 10px;
        text-transform: uppercase;
    }
    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
</style>
