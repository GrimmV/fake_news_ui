<script lang="ts">
  import SimilarsVisual from "./SimilarsVisual.svelte";
  import Visual from "./Visual.svelte";
  import WordShapVisual from "./WordShapVisual.svelte";
  import { visualDescriptions } from "./utils/visual_descriptions";

  export let modules = [];
  export let datapointId: number;
  export let username: string;

  let similar_visuals = ["similar predictions", "counterfactuals"];
  console.log(modules);
</script>

<div class="grid grid-cols-4 md:grid-cols-2">
  {#each modules as my_module}
    {#if similar_visuals.includes(my_module.name)}
      <SimilarsVisual
        module={my_module.name}
        params={my_module.params}
        description={visualDescriptions[my_module.name]}
        {datapointId}
        {username}
      />
    {:else if my_module.name === "word importance"}
      <WordShapVisual
        module={my_module.name}
        params={my_module.params}
        description={visualDescriptions[my_module.name]}
        {datapointId}
        {username}
      />
    {:else}
      <Visual
        module={my_module.name}
        description={visualDescriptions[my_module.name]}
        params={my_module.params}
        paramOptions={my_module.param_options}
        {datapointId}
        {username}
      />
    {/if}
  {/each}
</div>
