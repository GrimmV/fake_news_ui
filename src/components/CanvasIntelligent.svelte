<script lang="ts">
  import SimilarsVisualIntelligent from "./SimilarsVisualIntelligent.svelte";
  import VisualIntelligent from "./VisualIntelligent.svelte";
  import WordShapVisualIntelligent from "./WordShapVisualIntelligent.svelte";
  import { visualDescriptions } from "./utils/visual_descriptions";

  export let modules: any[] = [];
  export let ai_insights: any[] = [];
  export let datapointId: number;
  export let username: string;

  let similar_visuals = ["similar predictions", "counterfactuals"];
  console.log(modules);

  const retrieve_ai_insights = (module_name: string) => {
    return ai_insights.filter((insight) => insight.module === module_name);
  };
</script>

<div class="grid grid-cols-4 md:grid-cols-1">
  {#each modules as my_module}
    {@const ai_insights = retrieve_ai_insights(my_module.name)}
    {#if ai_insights.length > 0}
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
          {datapointId}
          {username}
        />
      {/if}
    {/if}
  {/each}
</div>
