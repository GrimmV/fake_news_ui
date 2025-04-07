<script lang="ts">
  export let step: string;
  export let status: string;
</script>

<div class="message assistant">
    {#if status === "pending"}
        <span><i class="fa-solid fa-spinner animate-spin"></i> {step}</span>
    {:else}
        <span><i class="fa-solid fa-check text-destructive"></i> {step}</span>
    {/if}
</div>

<style>
  .message {
    max-width: 75%;
    padding: 8px 12px;
    border-radius: 12px;
    word-wrap: break-word;
  }
  .assistant {
    align-self: flex-start;
    background-color: #ffffff;
    border: 1px solid #ccc;
  }
</style>
