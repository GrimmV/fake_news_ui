<script lang="ts">
  import Decision from "./Decision.svelte";
  import Progress from "./Progress.svelte";

  export let dots;
  export let toNext;
  export let showDecision: Boolean;

  console.log(showDecision)
</script>

<div class="fixed w-full">
  <div class="flex gap-10 justify-center items-center m-2 p-2 shadow-md rounded-md">
    <Progress {dots} />
    {#if showDecision}
      <Decision {toNext} />
    {/if}
  </div>
</div>
