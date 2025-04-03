<script>
  import ChatWindow from "./ChatWindow.svelte";
  import PredictionOverview from "./PredictionOverview.svelte";
  import Canvas from "./Canvas.svelte";
</script>

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

<div class="container">
  <div class="left-panel">
    <div class="top-left"><PredictionOverview/></div>
    <div class="bottom-left"><Canvas/></div>
  </div>
  <div class="chat"><ChatWindow/></div>
</div>
