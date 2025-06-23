<script lang="ts">
  import Decision from "./Decision.svelte";
  import Progress from "./Progress.svelte";

  export let isFinish;
  export let dots;
  export let toNext;
  export let showDecision: Boolean;

  console.log(showDecision)
</script>

<div class="w-full">
  <div class="flex gap-10 justify-center items-center m-2 p-2 shadow-md rounded-md">
    <Progress {dots} {isFinish}/>
    {#if showDecision}
      <div class="flex flex-col items-center gap-2">
        <p class="text-sm font-bold">I think the statement is...</p>
        <Decision {toNext} />
      </div>
    {/if}
  </div>
</div>
