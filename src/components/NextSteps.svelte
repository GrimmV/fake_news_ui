<script lang="ts">
    interface NextSteps {
      suggestion1: string;
      suggestion2: string;
      suggestion3: string; // e.g., 'user', 'assistant', 'system'
    }
    export let content: NextSteps;
  </script>
  
  <div class="message assistant">
      <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Suggestions for Next Steps</h2>
      <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>{content.suggestion1}</li>
        <li>{content.suggestion2}</li>
        <li>{content.suggestion3}</li>
      </ul> 
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
  