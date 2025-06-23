<script lang="ts">
  import SocialPost from "./SocialPost.svelte";
  import RangeIndicator from "./RangeIndicator.svelte";

  export let post;
  export let isLoading;
  export let error;

  console.log(post);
</script>

<div class="flex flex-col items-center gap-4">
  {#if isLoading || !post}
    <div class="loading">Loading prediction overview...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    <div class="gap-4 flex flex-col">
      <SocialPost
        content={post.statement}
        username={post.author}
        avatar={post.avatar}
        date={post.date}
      />
      <div class="flex align-center justify-center">
        <div class="font-bold mr-2">Model Prediction:</div>
        <div class="font-bold mr-2">The statement is </div>
        <div
          class="font-bold"
          style="color: {post.prediction.label === 'False'
            ? 'red'
            : post.prediction.label === 'Neither'
              ? 'grey'
              : 'green'};"
        >
          {post.prediction.label}
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        {#each Object.entries(post.properties) as [key, { value, min, max, description }]}
          <RangeIndicator {value} {min} {max} title={key} {description} />
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
