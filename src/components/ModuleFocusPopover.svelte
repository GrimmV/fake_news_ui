<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Popover from "$lib/components/ui/popover";

    export let assessment_loading: boolean = false;
    export let update_assessment: () => void;

    console.log(assessment_loading);
  </script>
  
  <Popover.Root portal={null}>
    <Popover.Trigger asChild let:builder>
      <Button builders={[builder]} class="h-full w-24" variant="outline" disabled={assessment_loading}
        ><i class="fa-solid fa-rotate-right mr-2"></i>Focus</Button
      >
    </Popover.Trigger>
    <Popover.Content class="w-80">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted-foreground">
            The assistant will reconsider its assessment with a special focus on this module.
        </p>
        <Button on:click={update_assessment} disabled={assessment_loading}><i class="fa-solid fa-rotate-right mr-2"></i>Reassess with module focus</Button>
      </div>
    </Popover.Content>
  </Popover.Root>
  