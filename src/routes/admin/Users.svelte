<script>
  import { onMount, onDestroy } from "svelte";
  import * as api from "../../helpers/api";
  import Message from "../../components/Message.svelte";
  import LoadingSpinner from "../../components/Ui/LoadingSpinner.svelte";
  import ls from "local-storage";
  import { formatDate } from "../../helpers/utils";
  import { push, replace } from "svelte-spa-router";
  import { Toast } from "../../helpers/toast";
  import defaultImg from "../../assets/images/default-image.jpg";
  import { location } from "svelte-spa-router";
  import { paginate, PaginationNav } from "../../components/UI/paginate";
  import usersStore from "../../stores/usersStore";

  let items = [];
  let error;
  let isLoading = true;
  let memberSince;
  let isAdmin;
  let unsubscibe;
  let currentPage;
  let pageSize;
  let totalItems;
  let users;
  let pageNumber = 1;

  const token = ls.get("jwt");
  async function getUsers(currentPage) {
    try {
      const res = await api.get(`admin/users/${currentPage}`, token);
      if (res && res.errors) {
        error = res.errors.message;
        isLoading = false;
      }
      usersStore.setUsers(res.users);
      items = res.users;
      users = res.users;
      totalItems = res.totalItems;
      pageSize = res.resPerPage;
      isLoading = false;

      return users;
    } catch (err) {
      isLoading = false;
      error = err;
      ls.remove("jwt");
      return window.location.replace("/");
    }
  }
  getUsers(currentPage);

  $: paginatedItem = paginate({ items, pageSize, currentPage });

  unsubscibe = usersStore.subscribe(i => {
    users = i;
  });

  onDestroy(() => {
    if (unsubscibe) {
      unsubscibe();
    }
  });

  window.onhashchange = function() {
    pageNumber = $location.substring($location.lastIndexOf("/") + 1);
    getUsers(pageNumber);
    currentPage = parseInt(pageNumber);
  };
  function handleSetPage(e) {
    currentPage = e.detail.page;
    push(`/admin/users/${e.detail.page}`);
  }
</script>

<style>
  li.active a {
    color: #00818b;
  }
  .tabs {
    margin: 20px 0;
  }
  .default-img {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .link {
    background: #fdac17;
    padding: 12px;
    float: right;
    color: white;
  }
  .link:hover {
    opacity: 0.9;
  }
</style>

<svelte:head>
  <title>Admin Panel</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isLoading}
  <section>
    <LoadingSpinner />
  </section>
{/if}

{#if error}
  <Message message={error} messageType="warning" />
{:else}
  <section>
    <div class="card">
      <header class="card-header">
        <div class="card-header-title">Admin Panel</div>
        <div class="card-header-icon">:::</div>
      </header>
      <div class="tabs">
        <ul>
          <li class="is-active">
            <a>Users</a>
          </li>
          <li>
            <a>Quotes</a>
          </li>
          <li>
            <a>Emails</a>
          </li>
        </ul>
      </div>

      <div class="card-content">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>
                  <abbr title="Position">Pos</abbr>
                </th>
                <th>
                  <abbr title="User Porfolio Image">Image</abbr>
                </th>
                <th>
                  <abbr title="Email">Email</abbr>
                </th>
                <th>
                  <abbr title="User Name">Name</abbr>
                </th>
                <th>
                  <abbr title="Gender">Gender</abbr>
                </th>
                <th>
                  <abbr title="Website">Website</abbr>
                </th>
                <th>
                  <abbr title="Location">Location</abbr>
                </th>
                <th>
                  <abbr title="Customer Since">Customer Since</abbr>
                </th>
                <th>
                  <abbr title="Action Button">Action</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {#each users as user, i}
                <tr>
                  <td>{i + 1}</td>
                  <td>
                    {#if user.avatar}
                      <img
                        class="default-img"
                        src={user.avatar}
                        alt="User Image" />
                    {:else}
                      <img
                        class="default-img"
                        src={defaultImg}
                        alt="User Image" />
                    {/if}
                  </td>
                  <td>
                    <span data-id={user._id}>{user.email}</span>
                  </td>
                  <td>{user.profile.name}</td>
                  <td>{user.profile.gender}</td>
                  <td>{user.profile.website}</td>
                  <td>{user.profile.location}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <a href="#/admin/user/{user._id}">
                      <i class="fa fa-link link" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <PaginationNav
          {totalItems}
          {pageSize}
          currentPage={currentPage}
          limit={1}
          showStepOptions={true}
          on:setPage={handleSetPage} />

      </div>

    </div>
  </section>
{/if}
