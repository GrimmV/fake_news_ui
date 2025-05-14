<script lang="ts">
  import { onMount } from "svelte";
  import { getModelVisual } from "../../fetching/visuals";
  import Info from "./Info.svelte";

  export let module: string;
  export let params;
  export let insights: string;
  export let datapointId: number;
  export let username: string;
  export let description: string;

  let sentence =
    "More businesses are closing than are opening for the first time in our nation's history.";
  let values = {
    "35": 0.0064,
    businesses: 0.0114,
    closing: 0.0035,
    first: 0.0106,
    for: 0.0209,
    have: 0.0088,
    in: 0.0224,
    more: 0.0375,
    starting: 0.0089,
    than: 0.0251,
    the: 0.0099,
    time: 0.0067,
    we: 0.0207,
    years: 0.0119,
  };

  let isLoading: boolean = false;
  let error: string | null = null;
  let sentenceElement;

  async function fetchVisual() {
    isLoading = true;
    error = null;

    try {
      const response = await getModelVisual(
        module,
        params,
        datapointId,
        username
      );
      sentence = response["statement"];
      values = response["values"];
      console.log(response);
      console.log(sentence);
      console.log(values);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load visual";
      console.error("Error fetching visual:", err);
    } finally {
      isLoading = false;
    }
  }
  onMount(() => {
    fetchVisual();
  });

  // Normalize weights to 0-1 range
  $: normalizedWeights = (() => {
    const weightValues = Object.values(values);
    const max = Math.max(...weightValues);
    const min = Math.min(...weightValues);

    const normalized = {};
    for (const [word, weight] of Object.entries(values)) {
      normalized[word.toLowerCase()] = (weight - min) / (max - min);
    }
    return normalized;
  })();

  // Get RGB color based on weight (0-1)
  function getColor(weight) {
    // Gradient from blue (low) to red (high)
    const r = Math.round(weight * 255);
    const b = Math.round((1 - weight) * 255);
    return `rgb(${r}, 0, ${b})`;
  }

  // Split sentence into words and spans with colors
  $: coloredSentence = (() => {
    const words = sentence.split(/\b/); // Split on word boundaries

    return words
      .map((word) => {
        const lowerWord = word.toLowerCase();
        if (normalizedWeights[lowerWord] !== undefined) {
          const weight = normalizedWeights[lowerWord];
          const color = getColor(weight);
          return `<span style="color: ${color}; font-weight: bold">${word}</span>`;
        }
        return word;
      })
      .join("");
  })();
</script>

<div class="flex">

  <div class="flex flex-col sentence m-2 min-w-96 h-96 items-center relative">
    <div class="absolute top-0 right-0"><Info text={description} /></div>
    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
      Word Weights
    </h3>
    <div>
      {@html coloredSentence}
    </div>
  </div>
  <div class="insights">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Insights</h2>
    <div class="insights-text">{insights}</div>
  </div>
</div>

<style>
  .sentence {
    font-family: Arial, sans-serif;
    font-size: 18px;
    line-height: 1.6;
  }
</style>
