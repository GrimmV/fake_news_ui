<script lang="ts">
  import SocialPost from "./SocialPost.svelte";
  import RangeIndicator from "./RangeIndicator.svelte";

  export let post;
  export let isLoading;
  export let error;
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
        {#each Object.entries(post.properties) as [key, { value, min, max, description }]}
          <RangeIndicator {value} {min} {max} title={key} description={description}/>
        {/each}
      </div>
    </div>
    <div class="prediction-container">
      <div class="prediction-label">Model Prediction: {post.prediction.label}</div>
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
