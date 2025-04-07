<script lang="ts">
  interface IInsights {
    observations: string;
    conclusions: string;
    critical_reflection: string; // e.g., 'user', 'assistant', 'system'
  }
  export let content: IInsights;
</script>

<div class="message assistant">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Observations</h2>
    <p>{content.observations}</p>
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Conclusions</h2>
    <p>{content.conclusions}</p>
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Critical Reflections</h2>
    <p>{content.critical_reflection}</p>
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
