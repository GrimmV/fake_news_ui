<script lang="ts">
  import Canvas from "./Canvas.svelte";

  export let datapointId: number;
  export let username: string;

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

  let modules = {
    data: [
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
    ],
    model: [
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
    ],
    individual: [
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
    ],
  };
</script>

<div class="flex flex-col justify-center items-center mt-5">
  <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
    Dashboard
  </h1>
  <div>
    <p class="leading-7 [&:not(:first-child)]:mt-6">
      The Dashboard is structured in the following way:
    </p>
    <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
      <li>
        In the first section, you can explore how the underlying data is
        distributed over the value space and with respect to a given model
        prediction
      </li>
      <li>
        In the second part, you can explore the models performance and how much
        importance individual features have on average.
      </li>
      <li>
        Lastly, you can explore insights about the particular prediction at hand
        through means of feature importance and exploring similar datapoints.
      </li>
    </ul>
  </div>
  <div class="flex flex-col items-center">
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Data Overview
    </h2>
    <div class="m-2 p-2 shadow-md rounded-md">
      <Canvas modules={modules["data"]} {datapointId} {username} />
    </div>
  </div>
  <div class="flex flex-col items-center">
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Model Overview
    </h2>
    <div class="m-2 p-2 shadow-md rounded-md">
      <Canvas modules={modules["model"]} {datapointId} {username} />
    </div>
  </div>
  <div class="flex flex-col items-center">
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Specific Prediction
    </h2>
    <div class="m-2 p-2 shadow-md rounded-md">
      <Canvas modules={modules["individual"]} {datapointId} {username} />
    </div>
  </div>
</div>
