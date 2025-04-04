<script lang="ts">
  import { onMount } from "svelte";
  import { getPrediction } from "../../fetching/prediction";
  import SocialPost from "./SocialPost.svelte";
  import RangeIndicator from "./RangeIndicator.svelte";

  let isLoading: boolean = false;
  let error: string | null = null;

  let post = {
    author: "Gloria",
    statement:
      "George Washington said a free people should be armed to guard against government tyranny.",
    properties: {
      "Lexical Diversity (TTR)": { value: 1, min: 0, max: 1 },
      "Average Word Length": { value: 4.75, min: 3, max: 7 },
      "Avg Syllables per Word": { value: 1.38, min: 1, max: 2 },
      "Difficult Word Ratio": { value: 0.5, min: 0, max: 1 },
      "Dependency Depth": { value: 4, min: 1, max: 10 },
      Length: { value: 15, min: 5, max: 50 },
      Sentiment: { value: 0.9111, min: -1, max: 1 },
    },
    prediction: {
      label: "True",
      probas: {
        True: "79.61%",
        Neither: "12.84%",
        False: "7.55%",
      },
    },
  };

  async function fetchVisual() {
    isLoading = true;
    error = null;

    try {
      const response = await getPrediction();
      post = response;
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
</script>

<div class="post-container gap-4">
  {#if isLoading}
    <div class="loading">Loading prediction overview...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    <div class="gap-4 flex flex-col">
      <SocialPost
        content={post.statement}
        username={post.author}
        avatar={post.author}
      />
      <div class="grid grid-cols-3 gap-4">
        {#each Object.entries(post.properties) as [key, { value, min, max }]}
          <RangeIndicator {value} {min} {max} title={key} />
        {/each}
      </div>
    </div>
    <div class="prediction-container">
      <div class="prediction-label">Labeled as: {post.prediction.label}</div>
      <div class="probabilities">
        {#each Object.entries(post.prediction.probas) as [key, value]}
          <div class="probability"><strong>{key}</strong> {value}</div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .post-container {
    flex: 1;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: start;
  }
  .prediction-container {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    align-items: center;
    flex: 1;
    flex-direction: column;
  }
  .prediction-label {
    font-weight: bold;
    font-size: 1.1em;
  }
  .probabilities {
    display: flex;
    gap: 10px;
  }
  .probability {
    background: #e0f7fa;
    padding: 5px 10px;
    border-radius: 5px;
  }
</style>
