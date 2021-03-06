<script>
  import { validateRequired, validateEmail } from "../helpers/validate";
  import TextInput from "../components/Ui/TextInput.svelte";
  import { Toast } from "../helpers/toast";
  import Message from "../components/Message.svelte";
  import * as api from "../helpers/api.js";

  let error;
  let email = "";

  $: emailValid = validateEmail(email);
  $: formIsValid = emailValid;

  async function submitForm() {
    const forgotForm = document.getElementById("forgot-form");
    try {
      const userObject = {
        email: email
      };
      const res = await api.post(`users/forgot`, userObject);
      if (res && res.errors) {
        return (error = res.errors.message);
      }
      new Toast({
        message: res.message,
        type: "success"
      });
      forgotForm.reset();
    } catch (err) {
      return (error = err);
    }
  }
</script>

<svelte:head>
    <title>Forgot Password</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

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
  .la-card {
    border-radius: 4px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
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
      <form class="card la-card" id="forgot-form">
        <div class="card-content">
          <h2 class="la-headline">FORGOT PASSWORD</h2>
          <p class="centered">
            Enter your email address below and we'll send your password reset
            instructions.
          </p>
          <div class="la-divider">
            <hr class="la-divider-left" />
            <p class="la-divider-text">&nbsp;</p>
            <hr class="ua-divider-right" />
          </div>
          <TextInput
            id="email"
            label="Email"
            valid={emailValid}
            validityMessage="Please enter a valid email."
            value={email}
            className="is-large"
            on:input={event => (email = event.target.value)} />
          {#if error}
            <Message message={error} messageType="warning" />
          {/if}
          <div class="is-clearfix">
            <button
              class="button is-primary is-pulled-right"
              on:click|preventDefault={submitForm}
              disabled={!formIsValid}>
              Reset Password
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</section>
