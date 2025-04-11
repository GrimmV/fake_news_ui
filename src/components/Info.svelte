<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Tooltip from "$lib/components/ui/tooltip";

    export let text;
   </script>
    
   <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
     <Button builders={[builder]} variant="outline"><i class="fa-solid fa-question text-primary"></i></Button>
    </Tooltip.Trigger>
    <Tooltip.Content class="max-w-96" sideOffset={0}>
     <p>{text}</p>
    </Tooltip.Content>
   </Tooltip.Root>