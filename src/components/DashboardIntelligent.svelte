<script lang="ts">
  import CanvasIntelligent from "./CanvasIntelligent.svelte";
  import Button from "../lib/components/ui/button/button.svelte";

  export let datapointId: number;
  export let username: string;
  export let sendInitialRequest: () => void;
  export let ai_insights: any[] = [];
  export let ai_assessment: any = {};

  let features = [
    "Lexical Diversity (TTR)",
    "Average Word Length",
    "Avg Syllables per Word",
    "Difficult Word Ratio",
    "Dependency Depth",
    "Length",
    "sentiment",
  ];

  let labels = ["True", "Neither", "False"];

  let modules = [
    {
      name: "feature distribution",
      params: {
        feature_name: features[0],
        label: labels[0],
      },
      param_options: {
        feature_name: features,
        label: labels,
      },
    },
    {
      name: "feature distribution 2D",
      params: {
        feature_name_1: features[0],
        feature_name_2: features[1],
        label: labels[0],
      },
      param_options: {
        feature_name_1: features,
        feature_name_2: features,
        label: labels,
      },
    },
    {
      name: "performance metrics",
      params: {},
      param_options: {},
    },
    {
      name: "confusion matrix",
      params: {},
      param_options: {},
    },
    {
      name: "global feature importance",
      params: { label: labels[0] },
      param_options: { label: labels },
    },
    {
      name: "partial dependence plot",
      params: {
        feature_name: features[0],
        label: labels[0],
      },
      param_options: {
        feature_name: features,
        label: labels,
      },
    },
    {
      name: "word importance",
      params: {},
      param_options: {},
    },
    {
      name: "individual feature importance",
      params: {},
      param_options: {},
    },
    {
      name: "similar predictions",
      params: {},
      param_options: {},
    },
    {
      name: "counterfactuals",
      params: {},
      param_options: {},
    },
  ];
</script>

<div class="flex flex-col justify-center items-center mt-5">
  <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
    Intelligent Dashboard
  </h1>
  {#if ai_insights.length > 0}
    {#if Object.keys(ai_assessment).length === 0}
      <div>Waiting for assessment...</div>
    {:else}
      <div class="m-2 p-2 shadow-md rounded-md">
        Trustworthiness: {ai_assessment.trustworthiness}
      </div>
      <div class="m-2 p-2 shadow-md rounded-md">
        Confidence: {ai_assessment.score}
      </div>
      <div class="m-2 p-2 shadow-md rounded-md">
        Reason: {ai_assessment.reason}
      </div>
    {/if}
    <div class="m-2 p-2 shadow-md rounded-md">
      <CanvasIntelligent {modules} {ai_insights} {datapointId} {username} />
    </div>
  {:else}
    <Button on:click={sendInitialRequest}>Start Analysis</Button>
  {/if}
</div>
