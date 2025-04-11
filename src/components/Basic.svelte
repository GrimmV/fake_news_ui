<script>
  import PredictionOverview from "./PredictionOverview.svelte";

  export let post;
  export let error;
  export let isLoading;
</script>

<div class="flex flex-col justify-center items-center">
  <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
    Basic
  </h1>
  <PredictionOverview {post} {error} {isLoading} />
</div>
