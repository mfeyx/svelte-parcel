<script>
  import TextInput from "../components/Ui/TextInput.svelte";
  import { validateRequired, validateEmail } from "../helpers/validate.js";
  import * as api from "../helpers/api.js";
  import ls from "local-storage";
  import userStore from "../stores/user-store";
  import Message from "../components/Message.svelte";
  import ListErrors from "../components/ListErrors";
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";

  let name = "";
  let email = "";
  let company = "";
  let phone = "";
  let content = "";
  let error;
  let errors = null;
  let success;
  let token;

  $: nameValid = !validateRequired(name);
  $: emailValid = validateEmail(email);
  $: contentValid = !validateRequired(content);
  $: formIsValid = nameValid && emailValid && contentValid;

  async function submitForm() {
    const isHuman = document.getElementById("is-human").value;
    if (isHuman.length !== 0) {
      return false;
    }
    try {
      const userData = {
        name: name,
        email: email,
        content: content,
        company: company,
        phone: phone,
        token: token
      };
      const res = await api.post("contact", userData);
      if (res && res.errors) {
        errors = res.errors.error;
      } else {
        success = "Your email was sent successfully!";
        document.getElementById("my-form").reset();
      }
    } catch (err) {
      if (err) {
        return (error = err);
      }
    }
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      submitForm();
    }
  }
</script>

<style>
  .lg {
    font-size: 2em;
    margin-bottom: 0.3em;
  }
</style>

<svelte:window on:keydown={handleKeyDown} />

<svelte:head>
  <title>Contact Us Form</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="columns is-mobile">
  <div class="column is-10 is-offset-1">
    <div class="card">
      <div class="card-content is-clearfix">
        <h1 class="lg">How can we help you?</h1>
        <form id="my-form">
          <TextInput
            id="name"
            label="Name *"
            valid={nameValid}
            validityMessage="Please enter a valid name."
            value={name}
            className="is-large"
            on:input={event => (name = event.target.value)} />
          <TextInput
            id="email"
            label="Email *"
            valid={emailValid}
            validityMessage="Please enter a valid email."
            value={email}
            className="is-large"
            on:input={event => (email = event.target.value)} />
          <TextInput
            id="company"
            label="Company Name"
            type="text"
            validityMessage="Please enter a valid company name."
            value={company}
            className="is-large"
            on:input={event => (company = event.target.value)} />
          <TextInput
            id="phone"
            label="Phone Number(optional)"
            type="text"
            className="is-large"
            value={phone}
            on:input={event => (phone = event.target.value)} />
          <TextInput
            id="content"
            label="Message *"
            controlType="textarea"
            valid={contentValid}
            validityMessage="Message is required"
            value={content}
            className="is-large"
            bind:value={content} />

          <input type="hidden" id="is-human" />

          {#if success}
            <Message message={success} messageType="success" />
          {/if}

          {#if error}
            <Message message={error} messageType="warning" />
          {/if}

          <ListErrors {errors} />

          <button
            class="button is-primary is-pulled-right"
            on:click|preventDefault={submitForm}
            disabled={!formIsValid}>
            Submit Form
          </button>

        </form>
        <p>
          Generally, we are able to respond to inquiries within same business
          day.
        </p>
      </div>

    </div>
  </div>

</div>
