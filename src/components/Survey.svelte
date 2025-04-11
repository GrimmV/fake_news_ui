<script lang="ts">
  import uploadClicks from "../../fetching/firebase";

  export let uiType: "dashboard" | "simple" | "advanced";
  export let toNext;
  export let username: string;
  export let datapointId: number;

  // Store form values
  let formValues = {
    confidence: 0,
    helpfulness: 0,
    influentialAspects: [] as string[],
    easeOfUse: 0,
    challenges: "",
    naturalness: 0,
    otherInfluentialAspect: ""
  };

  // Handle form submission
  function handleSubmit(event: Event) {
    event.preventDefault();
    console.log("Form values:", formValues);
    let info = {
      action: "submit",
      content: {
        ...formValues,
        datapointId: datapointId,
      },
      username: username,
    };
    uploadClicks(info)
    toNext("");
    // Add your submission logic here (e.g., API call)
  }

  // Update checkboxes for multi-select
  function updateAspects(option: string, checked: boolean) {
    if (checked) {
      formValues.influentialAspects = [...formValues.influentialAspects, option];
    } else {
      formValues.influentialAspects = formValues.influentialAspects.filter(item => item !== option);
    }
  }
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Post-Interaction Feedback</h2>
  
  <form on:submit={handleSubmit} class="space-y-5">
    <!-- Question 1: Confidence -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        1. How confident are you in your final judgment?
      </label>
      <div class="flex justify-between text-xs text-gray-500">
        <span>Not confident</span>
        <span>Very confident</span>
      </div>
      <div class="mt-1 flex items-center space-x-4">
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

    <!-- Question 2: Helpfulness -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        2. How helpful was the UI?
      </label>
      <div class="flex justify-between text-xs text-gray-500">
        <span>Not helpful</span>
        <span>Extremely helpful</span>
      </div>
      <div class="mt-1 flex items-center space-x-4">
        {#each [1, 2, 3, 4, 5] as num}
          <label class="flex items-center">
            <input
              type="radio"
              name="helpfulness"
              value={num}
              bind:group={formValues.helpfulness}
              class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span class="ml-2 block text-sm text-gray-700">{num}</span>
          </label>
        {/each}
      </div>
    </div>

    <!-- Question 3: Influential Aspects -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        3. What aspects influenced your judgment? (Select up to 2)
      </label>
      <div class="space-y-2 mt-2">
        {#each [
          "Visualization of feature importance",
          "Explanation clarity",
          "Ability to ask questions",
          "Speed/ease of accessing information",
        ] as option}
          <label class="flex items-center">
            <input
              type="checkbox"
              name="influentialAspects"
              on:change={(e) => updateAspects(option, e.currentTarget.checked)}
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span class="ml-2 block text-sm text-gray-700">{option}</span>
          </label>
        {/each}
        <label class="flex items-center">
          <input
            type="checkbox"
            name="influentialAspects"
            on:change={(e) => updateAspects("Other", e.currentTarget.checked)}
            class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span class="ml-2 block text-sm text-gray-700">Other:</span>
          <input
            type="text"
            bind:value={formValues.otherInfluentialAspect}
            class="ml-2 block w-full text-sm border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
            placeholder="Specify"
          />
        </label>
      </div>
    </div>

    <!-- Question 4: Ease of Use -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        4. How easy was this UI to use?
      </label>
      <div class="flex justify-between text-xs text-gray-500">
        <span>Very difficult</span>
        <span>Very easy</span>
      </div>
      <div class="mt-1 flex items-center space-x-4">
        {#each [1, 2, 3, 4, 5] as num}
          <label class="flex items-center">
            <input
              type="radio"
              name="easeOfUse"
              value={num}
              bind:group={formValues.easeOfUse}
              class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span class="ml-2 block text-sm text-gray-700">{num}</span>
          </label>
        {/each}
      </div>
    </div>

    <!-- Question 5: Challenges -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        5. Any challenges or confusion?
      </label>
      <textarea
        bind:value={formValues.challenges}
        rows={2}
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Optional"
      />
    </div>

    <!-- Question 6 (Conditional) -->
    {#if uiType !== "dashboard"}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          6. How natural did the conversation feel?
        </label>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Unnatural</span>
          <span>Very natural</span>
        </div>
        <div class="mt-1 flex items-center space-x-4">
          {#each [1, 2, 3, 4, 5] as num}
            <label class="flex items-center">
              <input
                type="radio"
                name="naturalness"
                value={num}
                bind:group={formValues.naturalness}
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span class="ml-2 block text-sm text-gray-700">{num}</span>
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