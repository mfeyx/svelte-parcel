<script>
    import {fade} from 'svelte/transition';
    export let message;
    export let messageType;

</script>

{#if message}
<div class="notification is-{messageType} alert-dismissible" transition:fade>
    {message}
    <button type="button" class="close-button" on:click={()=> message = null }>
        <span aria-hidden="true">&times;</span>
    </button>
</div>
{/if}

<style>
    .notification{
        position: relative;
        padding: 15px 40px 15px 15px
    }
    .close-button{
        position: absolute;
        right: 0;
        top: 0;
        padding: 0;
        height: 100%;
        border: none;
        background: orange;
        width: 30px;
    }
    .close-button:hover{
        cursor: pointer;
    }
    .close-button span{
        font-size: 20px;
    }

</style>
