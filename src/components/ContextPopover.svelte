<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Label } from "$lib/components/ui/label";
  import * as Popover from "$lib/components/ui/popover";

  export let context: string[] = [];
  export let update_context: (context: string[]) => void;

  const MAX_CHARS = 100;
  const MAX_ENTRIES = 3;

  let newContext: string = "";
  const addContext = () => {
    if (newContext.trim() !== "") {
      context = [...context, newContext];
      update_context(context);
      newContext = "";
    }
  };
  const removeContext = (ctx: string) => {
    context = context.filter((c) => c !== ctx);
    update_context(context);
  };
</script>

<Popover.Root portal={null}>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline"
      ><i class="fa-solid fa-sliders mr-2"></i>Update Context</Button
    >
  </Popover.Trigger>
  <Popover.Content class="w-80">
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted-foreground">
        Provide any type of information that you think is relevant for the
        assessment
      </p>
      {#if context.length === 0}
        <p class="text-sm">No context provided yet</p>
      {:else}
        {#each context as ctx}
          <div class="flex flex-row items-center gap-1">
          <p>{ctx}</p>
          <Button on:click={() => removeContext(ctx)} variant="ghost"
            ><i class="fa-solid fa-xmark text-red-500"></i></Button
          >
          </div>
        {/each}
      {/if}
      <div class="flex flex-col gap-1">
        <Label for="context">New context:</Label>
        <Textarea
          id="context"
          maxlength={MAX_CHARS}
          bind:value={newContext}
          class="h-8 resize-none"
        />
        {#if context.length < MAX_ENTRIES}
          <Button on:click={addContext}>Add</Button>
        {:else}
          <Button on:click={addContext} disabled>Max entries: {MAX_ENTRIES}</Button>
        {/if}
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
