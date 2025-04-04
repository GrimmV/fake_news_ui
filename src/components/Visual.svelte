<script lang="ts">
    import { onMount } from 'svelte';
    import { getModelVisual } from '../../fetching/visuals';
  
    export let module: string;
    export let params: Record<string, string | number>;
  
    // let htmlContent: string = '';
    let iframeSrc = '';
    let isLoading: boolean = false;
    let error: string | null = null;
  
    async function fetchVisual() {
      isLoading = true;
      error = null;
      
      try {
        const response = await getModelVisual(module, params);
        const blob = response;
        iframeSrc = URL.createObjectURL(blob);
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load visual';
        console.error('Error fetching visual:', err);
      } finally {
        isLoading = false;
      }
    }
  
    onMount(() => {
      fetchVisual();
    });
  
    // Re-fetch when props change
    $: {
      if (module && params) {
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
        <iframe 
            src={iframeSrc} 
            class="visual-iframe" 
            title="Visualization"
            width="400px"
            height="300px"
            sandbox="allow-scripts allow-same-origin" 
        ></iframe>
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
  
    .loading, .error {
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