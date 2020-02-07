<script>
  import { onMount, onDestroy } from "svelte"
  import moment from "moment"
  import userStore from "../../stores/user-store.js"
  import ls from "local-storage"
  import * as api from "../../helpers/api.js"
  import Message from "../../components/Message.svelte"
  import { validateRequired, validateEmail, validatePassword } from "../../helpers/validate"
  import TextInput from "../../components/Ui/TextInput.svelte"
  import { replace } from "svelte-spa-router"
  import defaultImg from "../../assets/images/default-image.jpg"
  import { Toast } from "../../helpers/toast"
  import LoadingSpinner from '../../components/Ui/LoadingSpinner.svelte'

  let unsubscribe;
  let memberSince;
  let currentUser;
  let token;
  let userId;
  let editUser = false;
  let error;
  let email = "";
  let name = "";
  let userName = "";
  let location = '';
  let website = '';
  let gender = '';
  let gravatar = '';
  let password = '';
  let passwordConfirmation = '';
  let isLoading = true;

  token = ls.get("jwt");

  unsubscribe = userStore.subscribe(userData => {
    currentUser = userData;
    userId = currentUser._id;

    if (userId) {
      email = currentUser.email;
      if (currentUser.profile) {
        name = currentUser.profile.name || '';
        gender = currentUser.profile.gender || '';
        website = currentUser.profile.website || '';
        location = currentUser.profile.location || '';
      }
      function formatDate(date) {
        return moment(new Date(date)).format("MMMM DD, YYYY");
      }
      memberSince = formatDate(currentUser.memberSince);
      isLoading = false;
    }
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  $: emailValid = validateEmail(email);
  $: formIsValid = emailValid;

  $: passwordValid = validatePassword(password);
  $: passwordConfirmValid = (password === passwordConfirmation);
  $: passwordFormIsValid = passwordValid && passwordConfirmValid;

  async function updateUser() {
    try {
      const userObject = {
        name: name,
        email: email,
        website: website,
        location: location,
        gender: gender
      };
      const res = await api.patch(`users/${userId}`, userObject, token);
      if (res && res.errors) {
        return (error = res.errors.message);
      }
      userStore.setUser(res.user);
      new Toast({
        message: "User profile was updated successfully!",
        type: "success"
      });
      editUser = false;
      error = null;
    } catch (e) {
      if (e) {
        return (error = e);
      }
    }
  }

  async function deleteUser(){
    const result = confirm("Are you sure you want to delete your account?");
    if (result) {
      const res = await api.post(`users/delete`, {}, token);
      if(res && res.errors){
        return (error = res.errors.message);
      }
      ls.remove("jwt");
      new Toast({
        message: res.message,
        type: "success"
      });
      setTimeout(function () {
        window.location.replace('/');
      }, 3000);
    }
  }
  async function updatePasswrod(){
    const passwordForm = document.getElementById('password-reset-form');
    const userData = {
      password: password,
      passwordConfirmation: passwordConfirmation
    } 
    const res = await api.post(`users/update`, userData, token);
    if(res && res.errors){
      return error = res.errrors.message;
    }
    passwordForm.reset();
    new Toast({
      message: res.message,
      type: "success"
    });

  }
</script>

<svelte:head>
  <title>Profile Page</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

{#if isLoading}
  <section>
  <LoadingSpinner />  
  </section>
{/if}

{#if currentUser}
  <section>
    <div class="content clear">
      <h1 class="is-pulled-left">Profile Information</h1>
    </div>

    <div class="card profile is-clearfix">
      <div class="card-image">
        <figure class="image is-4by3">
          {#if currentUser.avatar}
            <img class="default-img" src={currentUser.avatar} alt="User Image" />
          {:else}
            <img class="default-img" src={defaultImg} alt="User Image" />
          {/if}
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            {#if name}
            <p class="is-4"><strong>Name: </strong> {name}</p>
            {/if}
            <p class="is-6"><strong>Email:</strong> {currentUser.email}</p>
            {#if website}
            <p class="is-4"><strong>Website: </strong> {website}</p>
            {/if}
            {#if location}
            <p class="is-4"><strong>Location: </strong> {location}</p>
            {/if}
            {#if gender}
            <p class="is-4"><strong>Gender: </strong> {gender}</p>
            {/if}
          <div class="member-since">
            <strong>Member Since: </strong><time>{memberSince}</time><br>
            <strong>Role: </strong><span class="capitalize">{currentUser.role}</span>
          </div>
          </div>
        </div>
      </div>
      <div class="edit-footer">
        <i
          class="edit-position fa fa-pencil-square-o"
          aria-hidden="true"
          on:click={() => (editUser = !editUser)} />
      </div>
    </div>
  </section>

  {#if editUser}
    <div class="content center-form">
      <form class="card edit-user-form">
        {#if error}
          <Message message={error} messageType="warning" />
        {/if}
        <TextInput
          id="name"
          label="Name"
          value={name}
          bind:value={name}
          on:input={event => (name = event.target.value)} />
        <TextInput
          id="email"
          label="Email"
          valid={emailValid}
          validityMessage="Please enter a valid email."
          value={email}
          bind:value={email}
          on:input={event => (email = event.target.value)} />  
        <TextInput
          id="website"
          label="Website"
          value={website}
          bind:value={website}
          on:input={event => (website = event.target.value)} />
        <TextInput
          id="location"
          label="Location"
          value={location}
          bind:value={location}
          on:input={event => (location = event.target.value)} />
          
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Gender </label>
            </div>
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="radio">
                    <input type="radio" bind:group={gender} value="Male">
                    Male
                  </label>
                  <label class="radio">
                    <input type="radio" bind:group={gender} value="Female">
                    Female
                  </label>
                    <label class="radio">
                    <input type="radio" bind:group={gender} value="Other">
                    Other
                  </label>
                </div>
              </div>
            </div>
          </div>
        <button
          class="button is-pulled-right is-primary"
          on:click|preventDefault={updateUser}
          disabled={!formIsValid}>
          Save
        </button>
      </form>
      <form class="card" id="password-reset-form">
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

          <button
          class="button is-pulled-right is-primary"
          on:click|preventDefault={updatePasswrod}
          disabled={!passwordFormIsValid}>
          Update Password
        </button>

      </form>
      <form>
        <div class="control is-clearfix">
          <button class="button is-danger is-pulled-right" on:click|preventDefault={deleteUser}>Delete Account</button>
        </div>
        <p class="help is-pulled-right">You can delete your account, but keep in mind this action is irreversible.</p>
      </form>
    </div>
  {/if}
{/if}

<style>
  .capitalize{
    text-transform: capitalize
  }
  .card .field-label{
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 1rem;
    text-align: left;
  }
  .member-since{
    color: gray;
    font-size: 12px;
    margin-top: 2em;
  }
  .member-since strong{
    color: gray;
  }
  .edit-footer {
    width: 100%;
    height: 100%;
    display: table;
    background: #f4f4f4;
  }
  .edit-position {
    float: right;
    clear: both;
    font-size: 2em;
    background: orange;
    color: white;
    padding: 8px 5px 5px 8px;
  }
  .edit-position:hover {
    cursor: pointer;
    opacity: 0.9;
  }
  .center-form {
    max-width: 600px;
    margin: 50px auto;
  }

  .center-form form {
    padding: 2em 2em 5em 2em;
  }

  .profile {
    max-width: 360px;
    width: 360px;
    margin: auto;
  }

  .edit-user-form {
    margin: 60px 0;
  }

  img.default-img {
    width: 150px;
    height: 150px;
    margin: auto;
  }
</style>
