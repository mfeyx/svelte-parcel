<script>
  import * as api from "../helpers/api.js";
  import Message from "../components/Message.svelte";
  import { Toast } from "../helpers/toast";
  import TextInput from "../components/Ui/TextInput.svelte";
  import { validatePassword } from "../helpers/validate";
  import { replace } from "svelte-spa-router";

  export let params = {};

  let error;
  let password = "";
  let passwordConfirmation = "";

  $: passwordValid = validatePassword(password);
  $: passwordConfirmValid = password === passwordConfirmation;
  $: passwordFormIsValid = passwordValid && passwordConfirmValid;

  async function submitForm() {
    const resetForm = document.getElementById("password-reset-form");
    const userData = {
      password: password,
      passwordConfirmation: passwordConfirmation
    };
    try {
      const res = await api.post(`users/reset/${params.resetToken}`, userData);
      if (res && res.errors) {
        return (error = res.errors.message);
      }
      new Toast({
        message: res.message,
        type: "success"
      });
      resetForm.reset();
      replace("/login");
    } catch (err) {
      return (error = err);
    }
  }
</script>

<style>
  .la-divider {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Brandon Text", "Asap", Verdana, Arial, sans-serif;
    color: #5c5c5c;
    font-weight: bold;
    width: 90%;
    margin: 0 auto;
  }
  .la-divider hr {
    flex-grow: 3;
    height: 2px;
    border: none;
    background-color: #f2f2f2;
  }
  .la-divider .la-divider-text {
    flex-grow: 1;
    text-align: center;
  }
  .la-headline {
    font-weight: bold;
    text-align: center;
    font-size: 30px;
    color: #00828c;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .centered {
    margin: 20px 0;
    text-align: center;
  }
</style>

<section>
  <div class="columns is-centered">
    <div class="column is-half">
      <div class="card">
        <div class="card-content">
          <form id="password-reset-form">
            <h2 class="la-headline">NEW PASSWORD</h2>
            <p class="centered">Enter your new password below</p>
            <div class="la-divider">
              <hr class="la-divider-left" />
              <p class="la-divider-text">&nbsp;</p>
              <hr class="ua-divider-right" />
            </div>
            <TextInput
              id="password"
              label="Password"
              type="password"
              valid={passwordValid}
              validityMessage="Please enter a valid password."
              value={password}
              on:input={event => (password = event.target.value)} />
            <TextInput
              id="passwordConfirmation"
              label="Password Confirmation"
              type="password"
              valid={passwordConfirmValid}
              validityMessage="Passwords did not match"
              value={passwordConfirmation}
              on:input={event => (passwordConfirmation = event.target.value)} />
            {#if error}
              <Message message={error} messageType="warning" />
            {/if}
            <div class="is-clearfix">
              <button
                class="button is-pulled-right is-primary"
                on:click|preventDefault={submitForm}
                disabled={!passwordFormIsValid}>
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
