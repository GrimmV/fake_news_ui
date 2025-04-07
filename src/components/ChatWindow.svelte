<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import StatusBubble from "./StatusBubble.svelte";
  import Insights from "./Insights.svelte";
  import NextSteps from "./NextSteps.svelte";

  export let messages;
  export let sendRequest: (message: string) => void;
  export let writeState;
  export let sendInitialRequest;

  let newMessage = "";

  function sendMessage() {
    if (newMessage.trim()) {
      sendRequest(newMessage);
      newMessage = "";
    }
  }
</script>

<div class="chat-container justify-between">
  {#if messages.length === 0}
    <Button on:click={sendInitialRequest}>Start Conversation</Button>
  {:else}
    <div class="messages">
      {#each messages as message}
        {#if message.type === "processing"}
          <StatusBubble step={message.message} status={message.status} />
        {:else if message.type === "insights"}
          <Insights content={message.message} />
        {:else if message.type === "next_steps"}
          <NextSteps content={message.message} />
        {:else}
          <div class="message {message.actor}">{message.message}</div>
        {/if}
      {/each}
    </div>
  {/if}
  {#if writeState === ""}
    <div class="input-area">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Type a message..."
        on:keydown={(e) => e.key === "Enter" && sendMessage()}
      />
      <Button on:click={sendMessage}>Send</Button>
    </div>
  {:else}
    <div class="input-area-closed">
      {writeState}
    </div>
  {/if}
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 10px;
    background-color: #f0f0f0;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 10px;
  }
  .message {
    max-width: 75%;
    padding: 8px 12px;
    border-radius: 12px;
    word-wrap: break-word;
  }
  .user {
    align-self: flex-end;
    background-color: #d1f7c4;
  }
  .assistant {
    align-self: flex-start;
    background-color: #ffffff;
    border: 1px solid #ccc;
  }
  .input-area {
    display: flex;
    gap: 8px;
    padding-top: 10px;
  }
  .input-area-closed {
    display: flex;
    gap: 8px;
    padding: 10px;
    background-color: lightgrey;
    justify-content: center;
    align-items: center;
  }
  input {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
</style>
