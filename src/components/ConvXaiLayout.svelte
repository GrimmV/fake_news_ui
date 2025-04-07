<script lang="ts">
  import { onMount } from "svelte";

  import ChatWindow from "./ChatWindow.svelte";
  import PredictionOverview from "./PredictionOverview.svelte";
  import Canvas from "./Canvas.svelte";

  import { handle_module_information } from "./utils/handle_module_information";

  let socket;
  let writeState: string = "Start conversation to interact";

  let visualized_modules = [];

  interface IMessage {
    messageId: number;
    message: any;
    actor: string; // e.g., 'user', 'assistant', 'system'
    type: string; // e.g., 'request', 'status', 'intermediate', 'final'
    status?: string; // e.g., 'pending', 'processing', 'done'
    step?: string; // e.g., 'retrieving data', 'summarizing', etc.
  }


  interface IRequest {
    request: string;
    type: string;
  }

  let messages: Array<IMessage> = [];

  function updateWriteState(info: string) {
    writeState = info
  }

  function upsertMessage(newMsg: IMessage) {
    const index = messages.findIndex(
      (msg) => msg.messageId === newMsg.messageId
    );
    if (index !== -1) {
      let updatedMessages = [...messages]
      updatedMessages[index] = newMsg;
      messages = [...updatedMessages]
    } else {
      messages = [...messages, newMsg]
    }
  }

  function sendAssistantResponse(messageId: number, type: string, status: string, message: any) {
    upsertMessage({
      messageId: messageId,
      message: message,
      actor: "assistant",
      type: type,
      status: status
    })
  }

  function sendInitialRequest() {
    updateWriteState("Wait for the assistant...")
    sendSystemRequest("", "initial");
  }

  function sendSystemRequest(message: string, type: string) {
    sendRequest({
      request: message,
      type: type,
    });
  }

  function sendUserRequest(message: string) {
    sendRequest({
      request: message,
      type: "request",
    });
    messages = [
      ...messages,
      {
        messageId: messages[messages.length - 1].messageId + 1,
        message: message,
        actor: "user",
        type: "request",
        status: "done"
      },
    ];
  }

  function sendRequest(message: IRequest) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log(message);
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open");
    }
  }

  onMount(() => {
    socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const messageId = data.id;
      const content = data.content;
      const type = data.type;
      const status = data.status;
      if (type === "processing") {
        sendAssistantResponse(messageId, type, status, content);
      } else if (type === "modules") {
        let [visualizations, explanations] = handle_module_information(
          content["modules"]
        );
        visualized_modules = visualizations;
        // explanations.forEach(element => {
        //   let expl_text = element.name + "\n" + element.explanation
        //   sendAssistantResponse(expl_text, "response");
        // });
      } else {
        sendAssistantResponse(messageId, type, status, content);
        updateWriteState("")
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (ev) => {
      console.log(ev);
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  });
</script>

<div class="container">
  <div class="left-panel">
    <div class="top-left"><PredictionOverview /></div>
    <div class="bottom-left"><Canvas modules={visualized_modules} /></div>
  </div>
  <div class="chat">
    <ChatWindow
      {messages}
      sendRequest={sendUserRequest}
      {writeState}
      {sendInitialRequest}
    />
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100vh;
  }
  .left-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .top-left {
    flex: 1;
    max-height: 33.33%;
    overflow: auto;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .bottom-left {
    flex: 2;
    overflow: auto;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .chat {
    width: 30%;
    min-width: 300px;
    border-left: 1px solid #ccc;
    overflow: auto;
  }
</style>
