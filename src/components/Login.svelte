<script lang="ts">
  import Button from "../lib/components/ui/button/button.svelte";
  import Input from "../lib/components/ui/input/input.svelte";
  import { usernames } from "./utils/usernames";

  import uploadClicks from '../../fetching/firebase';

  export let setUsername;

  let username = "";
  let wrongUsername = false;

  function handleLogin() {
    if (usernames.includes(username)) {
        setUsername(username)
        let info = {
            "action": "login",
            "content": {
              "success": true  
            },
            "username": username
        }
        uploadClicks(info)
        username = ""
        wrongUsername = false
    } else {
        wrongUsername = true
        let info = {
            "action": "login",
            "content": {
              "success": false  
            },
            "username": username
        }
        uploadClicks(info)
    }
  }

</script>

<div class="w-full h-screen flex justify-center items-center">
  <div class="flex flex-col w-80">
    <Input class="w-full" type="name" placeholder="username" bind:value={username}/>
    <Button class="w-full" on:click={handleLogin}>Login</Button>
    {#if wrongUsername}
        <p class="text-red-600">Username does not exist</p>
    {/if}
  </div>
</div>
