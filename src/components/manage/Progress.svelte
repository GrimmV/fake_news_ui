<script lang="ts">
  interface IDot {
    finishedBasic: boolean;
    isCorrectBasic: boolean;
    isFinished: boolean;
    isCorrect: boolean;
  }

  export let dots: Array<IDot>;
  export let isFinish: boolean;

  function getColor(isCorrect: Boolean) {
    if (isFinish) {
      if (isCorrect) {
        return "text-green-600";
      } else {
        return "text-red-600";
      }
    } else {
      return "";
    }
  }
</script>

<div class="flex gap-2 justify-center items-center">
  {#each dots as dot}
    <div class="flex flex-col gap-1">
      {#if dot.finishedBasic && !dot.isFinished}
        <span><i class="fa-regular fa-circle-dot"></i></span>
        <span><i class="fa-regular fa-circle"></i></span>
      {:else if dot.isFinished}
        <span
          ><i class="fa-regular fa-circle-dot {getColor(dot.isCorrectBasic)}"
          ></i></span
        >
        <span
          ><i class="fa-regular fa-circle-dot {getColor(dot.isCorrect)}"
          ></i></span
        >
      {:else}
        <span><i class="fa-regular fa-circle"></i></span>
        <span><i class="fa-regular fa-circle"></i></span>
      {/if}
    </div>
  {/each}
</div>
