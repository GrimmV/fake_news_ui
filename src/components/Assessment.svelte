<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import ContextPopover from "./ContextPopover.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  export let ai_assessment: any;
  export let highlight: any = false;
  export let updateHighlight: any;
  export let update_assessment: any;
  export let context: string[] = [];
  export let update_context: (context: string[]) => void;

  function toggleHighlight() {
    updateHighlight();
  }

  const reassess = () => {
    update_assessment();
  };
</script>

<div class="w-1/2 flex flex-col justify-start items-center">
  {#if Object.keys(ai_assessment).length === 0}
    <Skeleton class="h-[500px] w-[500px]" />
  {:else}
    <div
      class="flex flex-col gap-2 rounded-md {highlight
        ? 'border-2 border-primary box-border'
        : ''}"
    >
      {#if highlight}
        <div class="w-full text-center p-2 bg-secondary rounded-md">
          <p>Focused</p>
        </div>
      {:else}
        <Button
          on:click={toggleHighlight}
          class={highlight ? "bg-white text-black" : "bg-primary text-white"}
          >Focus on this</Button
        >
      {/if}
      <div class="m-2 p-2 shadow-md rounded-md">
        Trustworthiness: {ai_assessment.trustworthiness}
      </div>
      <div class="m-2 p-2 shadow-md rounded-md">
        Confidence: {ai_assessment.score}
      </div>
      <div class="m-2 p-2 shadow-md rounded-md">
        Reason: {ai_assessment.reason}
      </div>
    </div>
    {#if highlight}
      <div class="flex flex-row justify-center gap-2 py-2 my-1 w-full">
        <ContextPopover {context} {update_context} />
        <Button on:click={reassess}
          ><i class="fa-solid fa-rotate-right mr-2"></i>Reassess with context</Button
        >
      </div>
    {/if}
  {/if}
</div>
