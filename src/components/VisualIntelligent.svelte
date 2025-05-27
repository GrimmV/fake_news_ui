<script lang="ts">
  import * as Select from "../lib/components/ui/select";
  import uploadClicks from "../../fetching/firebase";
  import { deepEqual } from "./utils/deep_equal";
  import Info from "./Info.svelte";

  export let module: string;
  export let params: any;
  export let description: string;
  export let insights: string;
  export let paramOptions: any;
  export let datapointId: number;
  export let username: string;
  export let iframeSrc: string;

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
    }
  }
</script>

<div class="canvas-container w-fit h-fit">
  <div class="flex">
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
    <div class="insights">
      <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Insights</h2>
      <div class="insights-text">{insights}</div>
    </div>
  </div>
</div>

<style>
  .canvas-container {
    min-height: 300px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 1rem;
  }
</style>
