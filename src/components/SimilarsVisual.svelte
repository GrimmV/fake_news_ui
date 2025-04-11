<script lang="ts">
  import { onMount } from "svelte";
  import { getModelVisual } from "../../fetching/visuals";
  import Info from "./Info.svelte";

  export let module: string;
  export let datapointId: number;
  export let username: string;
  export let params;
  export let description: string;

  let label_mapper = ["True", "Neither", "False"];

  let similars = [];
  let replace_similars;

  let isLoading: boolean = false;
  let error: string | null = null;

  async function fetchVisual() {
    isLoading = true;
    error = null;

    try {
      const response = await getModelVisual(
        module,
        params,
        datapointId,
        username
      );
      similars = response["elems"];
      replace_similars = [];
      for (let index = 0; index < similars.length; index++) {
        if (index != 0) {
          replace_similars.push(similars[index]);
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load visual";
      console.error("Error fetching visual:", err);
    } finally {
      isLoading = false;
    }
  }
  onMount(() => {
    fetchVisual();
  });
</script>

<div class="flex flex-col gap-4 m-2 w-96 items-center relative">
  <div class="absolute top-0 right-0"><Info text={description}/></div>
  <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">{module}</h3>
  {#each replace_similars as item}
    <div class="rounded-2xl shadow-md p-4 border bg-white">
      <p class="text-sm text-muted-foreground mb-3">{item.phrase}</p>
      <div class="flex justify-between text-sm">
        <span class="font-medium">Prediction:</span>
        <span>{[label_mapper[item.predictions]]}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="font-medium">Similarity:</span>
        <span>{item.similarity}</span>
      </div>
    </div>
  {/each}
</div>
