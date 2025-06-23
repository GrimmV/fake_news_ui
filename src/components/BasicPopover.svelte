<script lang="ts">
  import { Root, Trigger, Content } from "../lib/components/ui/popover";
  import { Button } from "../lib/components/ui/button";
  import PredictionOverview from "./PredictionOverview.svelte";
  export let post: any;
  export let error: string | null;
  export let isLoading: boolean;
</script>

<div class="relative w-full">
  <Root portal={null}>
    <Trigger asChild let:builder>
      <Button
        builders={[builder]}
        class="absolute top-2 right-2 z-10"
        variant="outline"
      >
        <i class="fa-solid fa-eye mr-2"></i>Prediction
      </Button>
    </Trigger>
    <Content class="w-[600px]">
      <PredictionOverview {post} {error} {isLoading} />
    </Content>
  </Root>
</div>
