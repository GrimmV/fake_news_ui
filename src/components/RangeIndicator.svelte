<script lang="ts">
    import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
    
    export let value: number;
    export let min: number = 0;
    export let max: number = 100;
    export let title: string;
    export let icon = null; // Pass a Lucide icon component
    export let variant: "default" | "primary" | "success" | "warning" | "danger" = "default";
  
    // Calculate percentage
    $: percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
    // Variant colors
    $: colors = {
      default: { bg: "bg-primary/10", text: "text-primary", progress: "bg-primary" },
      primary: { bg: "bg-blue-500/10", text: "text-blue-500", progress: "bg-blue-500" },
      success: { bg: "bg-emerald-500/10", text: "text-emerald-500", progress: "bg-emerald-500" },
      warning: { bg: "bg-amber-500/10", text: "text-amber-500", progress: "bg-amber-500" },
      danger: { bg: "bg-rose-500/10", text: "text-rose-500", progress: "bg-rose-500" }
    }[variant];
  </script>
  
  <Card class="h-full hover:shadow-sm transition-shadow">
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-muted-foreground">{title}</h3>
        {#if icon}
          <div class={`h-5 w-5 ${colors.text}`}>
            {icon}
          </div>
        {/if}
      </div>
    </CardHeader>
    
    <CardContent class="pt-0">
      <div class="flex items-end justify-between">
        <div>
          <p class="text-2xl font-bold">
            {value}
            {#if max !== 100}
              <span class="text-sm font-normal text-muted-foreground">/{max}</span>
            {/if}
          </p>
        </div>
      </div>
      
      <!-- Mini progress bar -->
      <div class="mt-3 h-1.5 w-full rounded-full ${colors.bg}">
        <div
          class={`h-full rounded-full ${colors.progress}`}
          style={`width: ${percentage}%`}
        />
      </div>
    </CardContent>
  </Card>