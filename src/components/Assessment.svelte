<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import ContextPopover from "./ContextPopover.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import uploadClicks from "../../fetching/firebase";
  export let ai_assessment: any;
  export let highlight: any = false;
  export let updateHighlight: any;
  export let update_assessment: any;
  export let context: string[] = [];
  export let update_context: (context: string[]) => void;
  export let interaction: boolean = false;
  export let datapointId: string = "";
  export let username: string = "";
  let showDetailedReason = false;

  const trustworthinessMapping = {
    0: {
      label: "Poor",
      color: "text-red-500",
    },
    1: {
      label: "Fair",
      color: "text-yellow-500",
    },
    2: {
      label: "Good",
      color: "text-green-500",
    },
    3: {
      label: "Excellent",
      color: "text-blue-500",
    },
  };

  function toggleHighlight() {
    updateHighlight();
  }

  const reassess = () => {
    update_assessment();
  };

  function toggleReason() {
    showDetailedReason = !showDetailedReason;
    let info = {
      action: "assessment toggle",
      content: {
        highlight: highlight,
        datapointId: datapointId,
      },
      username: username,
    };
    uploadClicks(info);
  }
</script>

<div class="w-full flex flex-col justify-start items-center">
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
        Trustworthiness: <i
          class="fa-solid fa-circle {trustworthinessMapping[
            ai_assessment.judgement_rating
          ].color}"
        ></i>
        {trustworthinessMapping[ai_assessment.judgement_rating].label}
        <p>
          (of
          {#each Object.values(trustworthinessMapping) as elem}
            <i class="fa-solid fa-circle {elem.color}"> </i>{elem.label}
          {/each}
          )
        </p>
      </div>
      <div class="m-2 p-2 shadow-md rounded-md">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold">Reason:</span>
          <button
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            on:click={toggleReason}
          >
            {showDetailedReason ? 'Show Simple' : 'Show Detailed'}
          </button>
        </div>
        <div>
          {#if showDetailedReason}
            {ai_assessment.judgement_reason}
          {:else}
            {ai_assessment.judgement_reason_short}
          {/if}
        </div>
      </div>
    </div>
    {#if highlight && interaction}
      <div class="flex flex-row justify-center gap-2 py-2 my-1 w-full">
        <ContextPopover {context} {update_context} />
        <Button on:click={reassess}
          ><i class="fa-solid fa-rotate-right mr-2"></i>Reassess with context</Button
        >
      </div>
    {/if}
  {/if}
</div>
