
<script>
  import userStore from "../../stores/user-store"
  import { createEventDispatcher } from "svelte"
  import TextInput from "../Ui/TextInput.svelte"
  import * as api from "../../helpers/api.js"
  import { validateEmail, validatePassword, validateRequired } from "../../helpers/validate.js"
  import ls from "local-storage"
  import Message from "../../components/Message.svelte"
  import { replace } from "svelte-spa-router"
  import jwt_decode from 'jwt-decode'

  let email = ''
  let password = ''
  let key
  let keyCode
  let error
  let strategy = 'local'

  const dispatch = createEventDispatcher();

  $: emailValid = validateEmail(email);
  $: passwordValid = validatePassword(password);
  $: formIsValid = emailValid && passwordValid;

  async function submitForm() {
    error = null;
    try {
      const res = await api.post("users/login", { email, password, strategy });
        if (res && res.errors) {
        return (error = res.errors.message);
      } else {
        ls.set('jwt', res.token.token);
        userStore.setUser(res.user);
        await replace("/user/profile");
      }
    } catch (err) {
      if (err) {
        return (error = err);
      }
    }
  } // end of Submit form

  function cancel() {
    dispatch("cancel");
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      submitForm();
    }
  }
</script>

<style>
  .is-center {
    text-align: center;
    display: block;
    margin: 20px 0;
  }
  button {
    padding-right: 60px;
    padding-left: 60px;
  }
</style>

<svelte:window on:keydown={handleKeyDown} />

{#if error}
  <Message message={error} messageType="warning" />
{/if}

<form>
  <TextInput
    id="email"
    label="Email"
    valid={emailValid}
    validityMessage="Please enter a valid email."
    value={email}
    className="is-large"
    on:input={event => (email = event.target.value)} />

  <TextInput
    id="password"
    label="Password"
    type="password"
    valid={passwordValid}
    validityMessage="Please enter a valid password."
    value={password}
    className="is-large"
    on:input={event => (password = event.target.value)} />
</form>
<div class="clearfix is-center">
  <a href="#/forgot">Forgot Password?</a>
</div>

<button
  class="button is-primary is-pulled-right"
  on:click|preventDefault={submitForm}
  disabled={!formIsValid}>
  Login
</button>
