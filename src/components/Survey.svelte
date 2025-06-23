<script lang="ts">
  import uploadClicks from "../../fetching/firebase";

  export let uiType:
    | "dashboard"
    | "simple"
    | "advanced"
    | "interactive"
    | "double_assessment";
  export let toNext;
  export let username: string;
  export let datapointId: number;

  // Store form values
  let formValues = {
    confidence: 0,
    trust: 0,
    transparency: 0,
    usefulness: 0,
    reflection: 0,
    over_reliance: 0,
    dashboard_limitations: 0,
    single_llm_trust: 0,
    dual_llm_encouragement: 0,
    interaction_trust: 0,
  };

  // Handle form submission
  function handleSubmit(event: Event) {
    event.preventDefault();
    console.log("Form values:", formValues);
    let info = {
      action: "submit",
      content: {
        values: formValues,
        ui_type: uiType,
      },
      username: username,
      datapointId: datapointId,
    };
    uploadClicks(info);
    toNext("");
    // Add your submission logic here (e.g., API call)
  }

  // Update checkboxes for multi-select
  function updateAspects(option: string, checked: boolean) {
    if (checked) {
      formValues.influentialAspects = [
        ...formValues.influentialAspects,
        option,
      ];
    } else {
      formValues.influentialAspects = formValues.influentialAspects.filter(
        (item) => item !== option
      );
    }
  }
</script>

<div
  class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200"
>
  <h2 class="text-lg font-semibold text-gray-900 mb-4">
    Post-Interaction Feedback
  </h2>

  <form on:submit={handleSubmit} class="space-y-5">
    <!-- Question 1: Confidence -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        1. How <b>confident</b> are you in the moderation decision you made?
      </label>
      <div class="flex justify-between text-xs text-gray-500">
        <span>Not confident</span>
        <span>Very confident</span>
      </div>
      <div class="mt-1 flex items-center justify-between space-x-4">
        {#each [1, 2, 3, 4, 5] as num}
          <label class="flex items-center">
            <input
              type="radio"
              name="confidence"
              value={num}
              bind:group={formValues.confidence}
              class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span class="ml-2 block text-sm text-gray-700">{num}</span>
          </label>
        {/each}
      </div>
    </div>

    {#if uiType !== "dashboard"}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          2. How much do you <b>trust</b> the assistant's assessment in this case?
        </label>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Not at all</span>
          <span>Completely</span>
        </div>
        <div class="mt-1 flex items-center justify-between space-x-4">
          {#each [1, 2, 3, 4, 5] as num}
            <label class="flex items-center">
              <input
                type="radio"
                name="trust"
                value={num}
                bind:group={formValues.trust}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{num}</span>
            </label>
          {/each}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          3. How well could you <b>understand</b> why the assistant made this judgment?
        </label>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Not at all</span>
          <span>Completely</span>
        </div>
        <div class="mt-1 flex items-center justify-between space-x-4">
          {#each [1, 2, 3, 4, 5] as num}
            <label class="flex items-center">
              <input
                type="radio"
                name="transparency"
                value={num}
                bind:group={formValues.transparency}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{num}</span>
            </label>
          {/each}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          4. How <b>helpful</b> was the assistant's assessment in making your
          moderation decision?
        </label>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Not at all helpful</span>
          <span>Extremely helpful</span>
        </div>
        <div class="mt-1 flex items-center justify-between space-x-4">
          {#each [1, 2, 3, 4, 5] as num}
            <label class="flex items-center">
              <input
                type="radio"
                name="usefulness"
                value={num}
                bind:group={formValues.usefulness}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{num}</span>
            </label>
          {/each}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          5. Did you consider your <b>own judgment</b> more, equally, or less than the
          assistant's suggestion?
        </label>
        <div class="mt-1 flex flex-col items-left justify-between">
          {#each ["I mostly relied on the assistant", "I weighed both equally", "I mostly followed my own judgment"] as item, num}
            <label class="flex items-center">
              <input
                type="radio"
                name="over_reliance"
                value={num+1}
                bind:group={formValues.over_reliance}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{item}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    {#if uiType === "dashboard"}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          2. Did you feel the assistant overlooked any important information
          from the dashboard?
        </label>
        <div class="mt-1 flex items-center space-x-4">
          {#each ["Yes", "No"] as item, num}
            <label class="flex items-center">
              <input
                type="radio"
                name="dashboard_limitations"
                value={num+1}
                bind:group={formValues.dashboard_limitations}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{item}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    {#if uiType === "simple"}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          6. Did you feel the assistant overlooked any important information
          from the dashboard?
        </label>
        <div class="mt-1 flex items-center space-x-4">
          {#each ["Yes", "No"] as item, num}
            <label class="flex items-center">
              <input
                type="radio"
                name="single_llm_trust"
                value={num+1}
                bind:group={formValues.single_llm_trust}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{item}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    {#if uiType === "double_assessment"}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          6. Did seeing two differing assessments help you reflect more
          critically on the decision?
        </label>
        <div class="mt-1 flex items-center space-x-4">
          {#each ["Not at all", "A little", "Somewhat", "A lot"] as item, num}
            <label class="flex items-center">
              <input
                type="radio"
                name="dual_llm_encouragement"
                value={num+1}
                bind:group={formValues.dual_llm_encouragement}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{item}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    {#if uiType === "interactive"}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          6. Did adding your own input make the assistant's re-evaluation feel
          more aligned with your judgment?
        </label>
        <div class="mt-1 flex items-center space-x-4">
          {#each ["Not at all", "A little", "Somewhat", "A lot"] as item, num}
            <label class="flex items-center">
              <input
                type="radio"
                name="interaction_trust"
                value={num+1}
                bind:group={formValues.interaction_trust}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{item}</span>
            </label>
          {/each}
        </div>
      </div>
    {/if}

    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Submit Feedback
    </button>
  </form>
</div>
