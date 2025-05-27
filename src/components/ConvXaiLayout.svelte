<script lang="ts">
  import { onMount } from "svelte";

  import PredictionOverview from "./PredictionOverview.svelte";
  import DashboardIntelligent from "./DashboardIntelligent.svelte";
  import uploadClicks from "../../fetching/firebase";

  export let post;
  export let error;
  export let isLoading;
  export let username: string;
  export let datapointId: number;
  export let port: string = "8765";

  let ai_insights: any[] = [];
  let ai_assessment1: any = {};
  let ai_assessment2: any = {};
  let socket: WebSocket | null = null;

  $: console.log(ai_insights);

  interface IRequest {
    meta: any;
    type: string;
    username: string;
    datapoint_id: number;
  }

  function sendInitialRequest() {
    let info = {
      action: "initialization",
      content: {
        datapointId: datapointId,
      },
      username: username,
    };
    uploadClicks(info);
    sendRequest({
      meta: {},
      type: "initialization",
      username: username,
      datapoint_id: datapointId,
    });
  }

  function update_assessment(
    context: string[] = [],
    assessment_type: string = "standard",
    module_focus: string = ""
  ) {
    let type = "update_assessment";
    let info = {
      action: type,
      content: {
        datapointId: datapointId,
        context: context,
        assessment_type: assessment_type,
        module_focus: module_focus,
      },
      username: username,
    };
    uploadClicks(info);
    if (assessment_type === "standard") {
      ai_assessment1 = {};
    } else {
      ai_assessment2 = {};
    }
    sendRequest({
      meta: {
        context: context,
        assessment_type: assessment_type,
        module_focus: module_focus,
        modules: ai_insights,
      },
      type: type,
      username: username,
      datapoint_id: datapointId,
    });
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
    console.log(port);
    if (port === "8765") {
      ws_url = import.meta.env.VITE_WEBSOCKET_1;
    } else {
      ws_url = import.meta.env.VITE_WEBSOCKET_2;
    }
    socket = new WebSocket(ws_url);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "module_update") {
        let content = data.data;
        let module_name = content.module_name;
        let params = content.params;
        // check if ai_insights contains an object with the same module name and params
        let index = ai_insights.findIndex(
          (insight) =>
            insight.module_name === module_name && insight.params === params
        );
        if (index === -1) {
          ai_insights = [...ai_insights, content];
        } else {
          ai_insights[index] = content;
        }
      } else if (data.type === "final_assessment") {
        let content = data.data;
        if (data.variant === "standard") {
          ai_assessment1 = content.summary;
        } else {
          ai_assessment2 = content.summary;
        }
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
      <DashboardIntelligent
        {datapointId}
        {username}
        {sendInitialRequest}
        {ai_insights}
        {ai_assessment1}
        {ai_assessment2}
        {update_assessment}
      />
    </div>
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
</style>
