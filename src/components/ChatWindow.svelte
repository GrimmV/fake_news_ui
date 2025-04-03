<script>
    import { Button } from "$lib/components/ui/button";
    
    let messages = [
      { sender: "user", text: "Hey there!" },
      { sender: "partner", text: "Hi! How are you?" }
    ];
    let newMessage = "";
  
    function sendMessage() {
      if (newMessage.trim()) {
        messages = [...messages, { sender: "user", text: newMessage.trim() }];
        newMessage = "";
      }
    }
  </script>
  
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
    .partner {
      align-self: flex-start;
      background-color: #ffffff;
      border: 1px solid #ccc;
    }
    .input-area {
      display: flex;
      gap: 8px;
      padding-top: 10px;
    }
    input {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #ccc;
    }
  </style>
  
  <div class="chat-container">
    <div class="messages">
      {#each messages as message}
        <div class="message {message.sender}">{message.text}</div>
      {/each}
    </div>
    <div class="input-area">
      <input type="text" bind:value={newMessage} placeholder="Type a message..." on:keydown={(e) => e.key === 'Enter' && sendMessage()} />
      <Button on:click={sendMessage}>Send</Button>
    </div>
  </div>
  