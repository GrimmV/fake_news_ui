<script lang="ts">
  import Visual from "./Visual.svelte";
  import { visualDescriptions } from "./utils/visual_descriptions";

  export let modules = [];
  export let datapointId: number;
  export let username: string;

  let similar_visuals = ["similar predictions", "counterfactuals"];
  console.log(modules);
</script>

<div class="flex gap-2 justify-center items-center flex-wrap">
  {#each modules as my_module}
    <Visual
      module={my_module.name}
      description={visualDescriptions[my_module.name]}
      params={my_module.params}
      paramOptions={my_module.param_options}
      {datapointId}
      {username}
    />
  {/each}
</div>
