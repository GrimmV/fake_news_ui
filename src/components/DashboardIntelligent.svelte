<script lang="ts">
  import CanvasIntelligent from "./CanvasIntelligent.svelte";
  import Button from "../lib/components/ui/button/button.svelte";
  import Assessment from "./Assessment.svelte";

  export let datapointId: number;
  export let username: string;
  export let sendInitialRequest: () => void;
  export let ai_insights: any[] = [];
  export let ai_assessment1: any = {};
  export let ai_assessment2: any = {};
  export let update_assessment: (
    context: string[],
    assessment_type: string,
    module_focus: string
  ) => void;

  let initialized = false;
  const context: {
    standard: string[];
    sceptical: string[];
  } = {
    standard: [],
    sceptical: [],
  };

  const update_context = (assessment_type: string, new_context: string[]) => {
    if (assessment_type === "standard") {
      context.standard = new_context;
    } else {
      context.sceptical = new_context;
    }
  };

  function initialize() {
    initialized = true;
    sendInitialRequest();
  }

  export let highlight: string = "left";
  let important_modules: any[] = [];

  $: if (highlight === "left") {
    important_modules = ai_assessment1.most_relevant_modules;
  } else {
    important_modules = ai_assessment2.most_relevant_modules;
  }

  $: assessment_loading =
    (highlight === "left" && Object.keys(ai_assessment1).length === 0) ||
    (highlight === "right" && Object.keys(ai_assessment2).length === 0);

  let features = [
    "us_vs_them_lang",
    "exaggerated_uncertainty",
    "source_quality",
    "victim_villain_language",
    "black_and_white_language",
    "dehumanization",
    "emotionality",
    "reading_difficulty",
    "sentiment",
    "polarization",
  ];

  function updateHighlight() {
    highlight = highlight === "left" ? "right" : "left";
  }

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
      name: "individual feature importance",
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
    {@const assessment_type = highlight === "left" ? "standard" : "sceptical"}
    <div class="flex flex-col gap-2 items-center justify-center">
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Assessment
      </h2>
      <div class="flex flex-row gap-2 mt-5 justify-around">
        <Assessment
          context={context["standard"]}
          update_context={(new_context: string[]) =>
            update_context("standard", new_context)}
          ai_assessment={ai_assessment1}
          highlight={highlight === "left"}
          {updateHighlight}
          update_assessment={() =>
            update_assessment(context["standard"], "standard", "")}
        />
        <Assessment
          context={context["sceptical"]}
          update_context={(new_context: string[]) =>
            update_context("sceptical", new_context)}
          ai_assessment={ai_assessment2}
          highlight={highlight === "right"}
          {updateHighlight}
          update_assessment={() =>
            update_assessment(context["sceptical"], "sceptical", "")}
        />
      </div>
    </div>
    <div class="m-2 p-2 shadow-md rounded-md">
      <CanvasIntelligent
        {modules}
        {ai_insights}
        {datapointId}
        {username}
        {important_modules}
        {assessment_loading}
        update_assessment={(module_focus: string) =>
          update_assessment(
            context[assessment_type],
            assessment_type,
            module_focus
          )}
      />
    </div>
  {:else}
    <Button on:click={initialize} disabled={initialized}>
      {#if initialized}
        Initializing...
      {:else}
        Start Analysis
      {/if}
    </Button>
  {/if}
</div>
