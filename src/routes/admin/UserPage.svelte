<script>
  import * as api from "../../helpers/api";
  import Message from "../../components/Message.svelte";
  import LoadingSpinner from "../../components/Ui/LoadingSpinner.svelte";
  import ls from "local-storage";

  export let params = {};
  let error;
  let userEmail = "";
  let userAvatar = "";
  let userName = "";
  let userRole = "";
  let userWebsite = "";
  let userLocation = "";
  let userGender = "";
  let isLoading = true;

  const token = ls.get("jwt");

  function closeError() {
    error = null;
  }

  (async () => {
    try {
      const res = await api.get(`admin/users/profile/${params.id}`, token);
      if (res && res.errors) {
          isLoading = false;
        error = res.errors.message;
      }
      isLoading = false;
      userEmail = res.email;
      userAvatar = res.avatar;
      userRole = res.role;
      userName = res.profile.name;
      userWebsite = res.profile.website;
      userLocation = res.profile.location;
      userGender = res.profile.gender;
    } catch (err) {
      isLoading = false;
      return (error = err);
    }
  })();
</script>

{#if isLoading}
  <section>
  <LoadingSpinner />  
  </section>
{/if}

<section>
  <div class="card">
    <div class="card-header">
          <h1 class="card-header-title">User Profile Info</h1>
          <div class="card-header-icon">:::</div>
    </div>
    <div class="card-content">

      <p><b>Name:</b> {userName}</p>
      <p><b>Email:</b> {userEmail}</p>
      <p><b>Gender:</b> {userGender}</p>
      <p><b>Location:</b> {userLocation}</p>
      <p><b>Role:</b> {userRole}</p>
      <p><b>Website:</b> {userWebsite}</p>
      <br>
      <img src={userAvatar} alt="user image" />
    </div>
  </div>

  {#if error}
    <Message
      message={error}
      on:closeMessageEvent={closeError}
      messageType="warning" />
  {/if}

</section>
