<script>
  import * as api from "../../helpers/api";
  import Message from "../../components/Message.svelte";
  import LoadingSpinner from "../../components/Ui/LoadingSpinner.svelte";
  import ls from "local-storage";
  import { formatDate } from "../../helpers/utils";
  import { replace } from "svelte-spa-router";
  import { Toast } from "../../helpers/toast";
  import defaultImg from "../../assets/images/default-image.jpg";

  let error;
  let isLoading = true;
  let users = [];
  let memberSince;
  let isAdmin;

  const token = ls.get("jwt");

  (async () => {
    try {
      const res = await api.get("admin/users", token);
      if (res && res.errors) {
        error = res.errors.message;
        isLoading = false;
        new Toast({
          message: res.errors.message,
          type: "success"
        });
        return replace("/");
      }
      if (res) {
        isLoading = false;
        for (const key in res) {
          users.push({
            ...res[key]
          });
        }
        return (users = res);
      }
    } catch (err) {
      isLoading = false;
      error = err;
    }
  })();
</script>

<style>
  .default-img {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
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
      <h1 class="card-header-title">Admin Panel</h1>
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
              </tr>
            </thead>
            <tbody>

              {#each users as user, i}
                <tr>
                  <td>
                    {i + 1}
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
                </tr>
              {/each}

            </tbody>
          </table>

        </div>

        <nav class="pagination" role="navigation" aria-label="pagination">
          <a href="#/admin/panel" class="pagination-previous">Previous</a>
          <a href="#/admin/panel" class="pagination-next">Next page</a>
          <ul class="pagination-list">
            <li>
              <a href="#/admin/panel" class="pagination-link" aria-label="Goto page 1">
                1
              </a>
            </li>
            <li>
              <span class="pagination-ellipsis">&hellip;</span>
            </li>
            <li>
              <a href="#/admin/panel" class="pagination-link" aria-label="Goto page 45">
                45
              </a>
            </li>
            <li>
              <a
                href="#/admin/panel"
                class="pagination-link is-current"
                aria-label="Page 46"
                aria-current="page">
                46
              </a>
            </li>
            <li>
              <a href="#/admin/panel" class="pagination-link" aria-label="Goto page 47">
                47
              </a>
            </li>
            <li>
              <span class="pagination-ellipsis">&hellip;</span>
            </li>
            <li>
              <a href="#/admin/panel" class="pagination-link" aria-label="Goto page 86">
                86
              </a>
            </li>
          </ul>
        </nav>
      </div>

    </div>
  </section>
{/if}
