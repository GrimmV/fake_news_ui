<script lang="ts">
  import { onMount } from "svelte";
  import { getModelVisual } from "../../fetching/visuals";
  import * as Select from "../lib/components/ui/select";

  import uploadClicks from "../../fetching/firebase";

  import { deepEqual } from "./utils/deep_equal";
  import Info from "./Info.svelte";

  export let module: string;
  export let params: any;
  export let description: string;
  export let paramOptions: any;
  export let datapointId: number;
  export let username: string;

  // let selectedParams = { ...params };

  let selectedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      {
        value: value,
        label: value,
        disabled: false,
      },
    ])
  );

  let paramOptionsEntries = Object.entries(paramOptions);

  let iframeSrc = "";
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
      const blob = response;
      // Revoke the old URL if it exists to avoid memory leaks
      if (iframeSrc) URL.revokeObjectURL(iframeSrc);
      iframeSrc = URL.createObjectURL(blob);
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

  // Re-fetch when props change
  $: {
    if (module && selectedParams) {
      let tmp_params = Object.fromEntries(
        Object.entries(selectedParams).map(([key, obj]) => [
          key,
          obj.value, // Extract the 'value' field
        ])
      );
      if (!deepEqual(params, tmp_params)) {
        let info = {
          action: "parameter change",
          content: {
            ...tmp_params,
            module: module,
            datapointId: datapointId,
          },
          username: username,
        };
        uploadClicks(info);
      }
      params = tmp_params;

      fetchVisual();
    }
  }
</script>

<div class="canvas-container w-fit h-fit">
  {#if isLoading}
    <div class="loading">Loading visualization...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    <div class="relative">
      <div class="absolute top-0 right-0"><Info text={description} /></div>
      <div class="flex">
        {#each paramOptionsEntries as [key, options]}
          <Select.Root portal={null} bind:selected={selectedParams[key]}>
            <Select.Trigger class="w-[180px]">
              <Select.Value placeholder={`Select ${key}`} />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>{key}</Select.Label>
                {#each options as option}
                  <Select.Item value={option}>{option}</Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        {/each}
      </div>
      <iframe
        src={iframeSrc}
        class="visual-iframe"
        title="Visualization"
        width="400px"
        height="300px"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  {/if}
</div>

<style>
  .canvas-container {
    min-height: 300px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1rem;
    background-color: white;
  }

  .loading,
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #666;
  }

  .error {
    color: #d32f2f;
  }
</style>
