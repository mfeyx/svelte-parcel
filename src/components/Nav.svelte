<script>
  import { onMount, onDestroy } from "svelte";
  import active from "svelte-spa-router/active";
  import userStore from "../../src/stores/user-store.js";
  import ls from "local-storage";
  import { replace, link } from "svelte-spa-router";
  import * as api from "../../src/helpers/api.js";

  let unsubscribe;
  let currentUser;
  let userId;
  let isAdmin = null;
  let isActive = false;
  let userName = "";
  let avatar = '';

  const token = ls.get("jwt");

  onMount(async () => {
    unsubscribe = await userStore.subscribe(userData => {
      currentUser = userData;
      avatar = userData.avatar;

        if (currentUser.profile) {
          if(currentUser.profile.name){
            userName = currentUser.profile.name;    
          } else {
             userName = currentUser.email;
          }
         
        }

      isAdmin = currentUser.role === "admin";
      userId = userData.id;
    });

    const classname = document.getElementsByClassName("navbar-item");
    Array.from(classname).forEach(function(e) {
      e.addEventListener("click", navAction);
    });

    // for (var i = 0; i < classname.length; i++) {
    //     classname[i].addEventListener('click', navAction, false);
    // }
  });

  async function logOut() {
    await api.post("users/logout");
    ls.remove("jwt");
    currentUser = null;
    isAdmin = null;
    window.location.replace("/");
  }
  function navAction(e) {
    e.stopPropagation();
    isActive = !isActive;
  }
  function bodyClicked(e) {
    if (isActive) {
      isActive = false;
    }
  }

  onDestroy(() => {
    if (unsubscribe) {
        unsubscribe();
    }
    });
</script>

<svelte:body on:click={bodyClicked} />

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/brand" use:link>
      <i class="fa fa-superpowers" aria-hidden="true" />
    </a>
    <a
      href="#/"
      role="button"
      class="navbar-burger burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample"
      on:click|stopPropagation|preventDefault={navAction}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>
  <div
    id="navbarBasicExample"
    class="navbar-menu {isActive ? 'is-active' : ''}">
    <div class="navbar-start">
      <a class="navbar-item" href="/" use:link use:active>Home</a>
      <a class="navbar-item" href="/contact" use:link use:active>Contact</a>
    </div>
    <div class="navbar-end">
      {#if !currentUser}
        <a class="navbar-item" href="/login" use:link use:active>Log in</a>
      {:else}
        <div class="navbar-item has-dropdown is-hoverable">
          {#if avatar}
            <span class="avatar navbar-item"><img src="{avatar}" alt="Profile Image"></span>
          {/if}      
          <span class="navbar-link">{userName}</span>
          <div class="navbar-dropdown is-right">
            {#if isAdmin}
              <a class="navbar-item" href="/admin/users/1" use:link>Admin</a>
            {/if}
            <a class="navbar-item" href="/user/profile" use:link>Profile</a>
            <hr class="navbar-divider" />
            <a class="navbar-item" on:click={logOut} href="#0">Logout</a>
          </div>
        </div>
      {/if}

    </div>
  </div>
</nav>

<style>
  .avatar.navbar-item img{
    min-height: 40px;
    border-radius: 100%
  }
  .avatar img{
    display: block;
    width: 40px;
    height: 40px;
  }
  #navbarBasicExample.is-active {
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 12px 0px;
  }
  .navbar {
    margin-bottom: 4em;
    min-height: 80px;
  }

  .navbar-link:not(.is-arrowless)::after {
    border-color: inherit;
  }

  .navbar-link:not(.is-arrowless)::after:hover {
    border-color: #00818b;
  }

  a.navbar-item:focus,
  a.navbar-item:focus-within,
  a.navbar-item:hover,
  a.navbar-item.is-active,
  .navbar-link:focus,
  .navbar-link:focus-within,
  .navbar-link:hover,
  .navbar-link.is-active {
    background-color: #fafafa;
    color: #00818b;
  }

  .fa-superpowers {
    color: #00818b;
    font-weight: bold;
  }

  nav {
    font-family: "Montserrat", sans-serif;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 12px 0px;
    font-weight: bold;
    height: 80px;
    min-height: 80px;
    margin-bottom: 2.5rem;
  }

  /* Style for "active" links; need to mark this :global because the router adds the class directly */
  :global(a.active::after) {
    position: absolute;
    content: "";
    width: calc(100% - 1.5em);
    height: 2px;
    background-color: #00818b;
    display: block;
    bottom: -1px;
  }

  :global(.active) {
    position: relative;
    color: #00818b;
  }

  a.navbar-item:hover {
    color: #00818b;
    background: #fafafa;
  }

  .navbar-brand a {
    padding: 1em 1.5em;
  }

  @media screen and (max-width: 1023px) {
    .navbar-brand {
      padding: 1em;
    }
    .navbar-menu {
      box-shadow: none;
    }
  }
</style>
