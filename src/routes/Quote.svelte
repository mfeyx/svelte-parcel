<script>
  import TextInput from "../components/Ui/TextInput.svelte";
  import { validateRequired, validateEmail } from "../helpers/validate.js";
  import * as api from "../helpers/api.js";
  import Message from "../components/Message.svelte";
  import { replace } from "svelte-spa-router";

  let name = "";
  let email = "";
  let company = "";
  let phone = "";
  let content = "";
  let error;
  let success;

  $: nameValid = !validateRequired(name);
  $: emailValid = validateEmail(email);
  $: companyValid = !validateRequired(company);
  $: contentValid = !validateRequired(content);
  $: formIsValid = nameValid && companyValid && emailValid && contentValid;

  async function submitForm() {
    try {
      const userData = {
        name: name,
        email: email,
        content: content,
        company: company,
        phone: phone
      };
      const res = await api.post("quotes/create", userData);
      if (res && res.errors) {
        error = res.errors.message;
      } else {
        success = 'Your quote was sent successfully!'
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

<svelte:window on:keydown={handleKeyDown} />

<svelte:head>
    <title>Get Quote</title>
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="columns is-mobile">
  <div class="column is-10 is-offset-1">
    <div class="card">
  <div class="card-content is-clearfix">
    <h1 class="lg">Tell us about your project</h1>
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
        label="Company Name *"
        type="text"
        valid={companyValid}
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

      {#if error}
        <Message message={error} messageType="warning" />
      {/if}

      {#if success}
        <Message message={success} messageType="success" />
      {/if}

      <button
        class="button is-primary is-pulled-right"
        on:click|preventDefault={submitForm}
        disabled={!formIsValid}>
        Submit Quote
      </button>

    </form>
    <p>
      Generally, we are able to respond to inquiries within same business day.
    </p>
  </div>
  
  </div>
</div>

</div>

<style>
  .lg{
    font-size: 2em;
    margin-bottom: .3em;
  }
</style>