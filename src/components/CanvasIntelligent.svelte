<script lang="ts">
  import SimilarsVisualIntelligent from "./SimilarsVisualIntelligent.svelte";
  import VisualIntelligent from "./VisualIntelligent.svelte";
  import WordShapVisualIntelligent from "./WordShapVisualIntelligent.svelte";
  import { visualDescriptions } from "./utils/visual_descriptions";
  import { getModelVisual } from "../../fetching/visuals";
  import { onMount } from "svelte";
  import ModuleFocusPopover from "./ModuleFocusPopover.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  export let modules: any[] = [];
  export let ai_insights: any[] = [];
  export let datapointId: number;
  export let username: string;
  export let important_modules: any[] = [];
  export let assessment_loading: boolean = false;
  export let update_assessment: (module_focus: string) => void;

  let similar_visuals = ["similar predictions", "counterfactuals"];
  let visualSrcs: Record<string, string> = {};

  const retrieve_ai_insights = (module_name: string) => {
    return ai_insights.filter((insight) => insight.module === module_name);
  };

  async function fetchVisual(module: string, params: any) {
    try {
      const response = await getModelVisual(
        module,
        params,
        datapointId,
        username
      );

      // Handle different response types
      if (response instanceof Blob) {
        // Revoke the old URL if it exists to avoid memory leaks
        if (visualSrcs[module]) URL.revokeObjectURL(visualSrcs[module]);
        visualSrcs[module] = URL.createObjectURL(response);
        visualSrcs = visualSrcs; // trigger reactivity
      } else {
        // For JSON responses (similar predictions, counterfactuals, word importance)
        visualSrcs[module] = response;
        visualSrcs = visualSrcs; // trigger reactivity
      }
    } catch (err) {
      console.error("Error fetching visual:", err);
    }
  }

  onMount(() => {
    // Initial fetch for all modules
    modules.forEach((my_module) => {
      const module_insights = retrieve_ai_insights(my_module.name);
      const params =
        module_insights.length > 0
          ? module_insights[0].params
          : my_module.params;
      fetchVisual(my_module.name, params);
    });
  });

  // Watch for changes in ai_insights
  $: {
    if (ai_insights) {
      modules.forEach((my_module) => {
        const module_insights = retrieve_ai_insights(my_module.name);
        if (module_insights.length > 0) {
          fetchVisual(my_module.name, module_insights[0].params);
        }
      });
    }
  }
</script>

<div class="flex flex-col items-center justify-center gap-6">
  <h2
    class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  >
    Canvas
  </h2>
  {#each modules as my_module}
    {@const ai_insights = retrieve_ai_insights(my_module.name)}
    {#if ai_insights.length > 0}
      <div
        class={(important_modules.includes(my_module.name)
          ? "border-1 border-primary bg-sky-100"
          : "") + " flex flex-row"}
      >
        {#if similar_visuals.includes(my_module.name)}
          <SimilarsVisualIntelligent
            module={my_module.name}
            params={ai_insights.length > 0
              ? ai_insights[0].params
              : my_module.params}
            insights={ai_insights.length > 0 ? ai_insights[0].summary : ""}
            description={visualDescriptions[my_module.name]}
            {datapointId}
            {username}
          />
        {:else if my_module.name === "word importance"}
          <WordShapVisualIntelligent
            module={my_module.name}
            params={ai_insights.length > 0
              ? ai_insights[0].params
              : my_module.params}
            insights={ai_insights.length > 0 ? ai_insights[0].summary : ""}
            description={visualDescriptions[my_module.name]}
            {datapointId}
            {username}
          />
        {:else}
          <VisualIntelligent
            module={my_module.name}
            description={visualDescriptions[my_module.name]}
            params={ai_insights.length > 0
              ? ai_insights[0].params
              : my_module.params}
            insights={ai_insights.length > 0 ? ai_insights[0].summary : ""}
            paramOptions={my_module.param_options}
            iframeSrc={visualSrcs[my_module.name]}
            {datapointId}
            {username}
          />
        {/if}
        <ModuleFocusPopover
          {assessment_loading}
          update_assessment={() => update_assessment(ai_insights[0].action)}
        />
      </div>
    {:else}
      <Skeleton class="h-[300px] w-[1000px]" />
    {/if}
  {/each}
</div>
