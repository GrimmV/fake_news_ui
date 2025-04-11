<script lang="ts">
  import { onMount } from "svelte";

  import ChatWindow from "./ChatWindow.svelte";
  import PredictionOverview from "./PredictionOverview.svelte";
  import Canvas from "./Canvas.svelte";

  import { handle_module_information } from "./utils/handle_module_information";
  import uploadClicks from "../../fetching/firebase";

  export let post;
  export let error;
  export let isLoading;
  export let username: string;
  export let datapointId: number;
  export let port: string = "8765";

  let socket;

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
    username: string;
    datapoint_id: number;
  }

  let visualized_modules =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("visualized_modules" + datapointId) || "[]")
      : [];
  let messages: Array<IMessage> =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("messages" + datapointId) || "[]")
      : [];

  let writeState: string =
    messages.length === 0 ? "Start conversation to interact" : "";

  // Persist changes automatically
  $: {
    if (typeof window !== "undefined") {
      localStorage.setItem("messages" + datapointId, JSON.stringify(messages));
      localStorage.setItem(
        "visualized_modules" + datapointId,
        JSON.stringify(visualized_modules)
      );
    }
  }

  function updateWriteState(info: string) {
    writeState = info;
  }

  function upsertMessage(newMsg: IMessage) {
    const index = messages.findIndex(
      (msg) => msg.messageId === newMsg.messageId
    );
    if (index !== -1) {
      let updatedMessages = [...messages];
      updatedMessages[index] = newMsg;
      messages = [...updatedMessages];
    } else {
      messages = [...messages, newMsg];
    }
  }

  function sendAssistantResponse(
    messageId: number,
    type: string,
    status: string,
    message: any
  ) {
    upsertMessage({
      messageId: messageId,
      message: message,
      actor: "assistant",
      type: type,
      status: status,
    });
  }

  function sendInitialRequest() {
    let info = {
      action: "initial user query",
      content: {
        datapointId: datapointId,
      },
      username: username,
    };
    uploadClicks(info);
    updateWriteState("Wait for the assistant...");
    sendSystemRequest("", "initial");
  }

  function sendSystemRequest(message: string, type: string) {
    sendRequest({
      request: message,
      type: type,
      username: username,
      datapoint_id: datapointId,
    });
  }

  function sendUserRequest(message: string) {
    let info = {
      action: "user query",
      content: {
        message: message,
        datapointId: datapointId,
      },
      username: username,
    };
    uploadClicks(info);
    sendRequest({
      request: message,
      type: "request",
      username: username,
      datapoint_id: datapointId,
    });
    let newMsg = {
      messageId: messages[messages.length - 1].messageId + 1,
      message: message,
      actor: "user",
      type: "request",
      status: "done",
    };
    upsertMessage(newMsg);
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
    let ws_url = "";
    console.log(port)
    if (port === "8765") {
      ws_url = import.meta.env.VITE_WEBSOCKET_1
    } else {
      ws_url = import.meta.env.VITE_WEBSOCKET_2
    }
    socket = new WebSocket(ws_url);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const messageId = data.id;
      const content = data.content;
      const type = data.type;
      const status = data.status;
      if (
        (type !== "processing" && type !== "modules" && type !== "insights") ||
        status === "done"
      ) {
        updateWriteState("");
      } else {
        updateWriteState("Wait for the assistant...");
      }
      if (type === "processing") {
        sendAssistantResponse(messageId, type, status, content);
      } else if (type === "modules") {
        let [visualizations, explanations] = handle_module_information(
          content["modules"]
        );
        visualized_modules = visualizations;
        console.log(visualizations);
      } else {
        sendAssistantResponse(messageId, type, status, content);
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
    <div class="top-left">
      <PredictionOverview {post} {error} {isLoading} />
    </div>
    <div class="bottom-left">
      <Canvas modules={visualized_modules} {username} {datapointId} />
    </div>
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
