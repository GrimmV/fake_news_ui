<script lang="ts">
  import { onMount } from "svelte";

  import ChatWindow from "./ChatWindow.svelte";
  import PredictionOverview from "./PredictionOverview.svelte";
  import Canvas from "./Canvas.svelte";

  import { handle_module_information } from "./utils/handle_module_information";

  let socket;
  let writeState: string = "Start conversation to interact";

  let visualized_modules = []

  interface IMessage {
    messageId: number;
    message: any;
    actor: string;
    type: string;
  }

  interface IRequest {
    request: string;
    type: string;
  }

  let messages: Array<IMessage> = []

  function sendAssistantResponse(message: any, type: string) {
    let id;
    if (messages.length === 0) {
      id = 0; 
    } else {
      id = messages[messages.length - 1].messageId + 1
    }
    messages = [
        ...messages,
        {
          messageId: id,
          message: message,
          actor: "assistant",
          type: type
        },
      ];
  }

  function sendInitialRequest() {
    sendSystemRequest("", "initial")
  }

  function sendSystemRequest(message: string, type: string) {
      sendRequest({
        "request": message,
        "type": type
      })
  }

  function sendUserRequest(message: string) {
    sendRequest({
      "request": message,
      "type": "request"
    })
    messages = [
        ...messages,
        {
          messageId: messages[messages.length - 1].messageId + 1,
          message: message,
          actor: "user",
          type: "request"
        },
      ];
  }

  function sendRequest(message: IRequest) {
    if (socket && socket.readyState === WebSocket.OPEN) {
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
      console.log(event);
      const data = JSON.parse(event.data);
      const text = data.text;
      const content = data.content
      const type = data.type;
      if (type === "response") {
        sendAssistantResponse(text, type);
      } else if (type === "modules") {
        let [visualizations, explanations] = handle_module_information(content["modules"])
        visualized_modules = visualizations
        explanations.forEach(element => {
          let expl_text = element.name + "\n" + element.explanation
          sendAssistantResponse(expl_text, "response");
        });
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
    <div class="bottom-left"><Canvas modules={visualized_modules}/></div>
  </div>
  <div class="chat"><ChatWindow {messages} sendRequest={sendUserRequest} {writeState} {sendInitialRequest}/></div>
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
