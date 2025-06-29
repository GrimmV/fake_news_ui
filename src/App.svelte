<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";
  import ConvXaiLayout from "./components/ConvXaiLayout.svelte";
  import Basic from "./components/Basic.svelte";
  import Manage from "./components/manage/Manage.svelte";
  import Login from "./components/Login.svelte";
  import { steps } from "./components/utils/steps";
  import { getPrediction } from "../fetching/prediction";
  import uploadClicks from "../fetching/firebase";
  import Survey from "./components/Survey.svelte";
  import Dashboard from "./components/Dashboard.svelte";
  import BasicPopover from "./components/BasicPopover.svelte";
  // Initialize from localStorage if available
  let username =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("username") || '""')
      : "";

  let activeStep =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("activeStep") || "0")
      : 0;

  let substep =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("substep") || '"basic"')
      : "basic";

  let isFinish =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("isFinish") || "false")
      : false;

  // Persist changes automatically
  $: {
    if (typeof window !== "undefined") {
      localStorage.setItem("username", JSON.stringify(username));
      localStorage.setItem("activeStep", JSON.stringify(activeStep));
      localStorage.setItem("substep", JSON.stringify(substep));
      localStorage.setItem("isFinish", JSON.stringify(isFinish));
    }
  }
  let dots = [];

  $: currentStep = steps[activeStep];
  $: datapointId = currentStep.datapoint;
  let post = null;

  let isLoadingPrediction: boolean = false;
  let errorPrediction: string | null = null;

  function toNext(choice: string) {
    if (substep === "basic" || substep === "analysis") {
      let info = {
        action: "user choice",
        content: {
          choice: choice,
          label: post.prediction.label,
          isCorrect: choice === post.prediction.label,
          datapointId: datapointId,
        },
        username: username,
      };
      uploadClicks(info);
    }
    if (substep === "basic") {
      substep = "analysis";
      dots[activeStep].finishedBasic = true;
      dots[activeStep].isCorrectBasic = choice === post.prediction.label;
    } else if (substep === "analysis") {
      dots[activeStep].isFinished = true;
      dots[activeStep].isCorrect = choice === post.prediction.label;
      substep = "survey";
    } else {
      if (activeStep < steps.length - 1) {
        activeStep += 1;
        substep = "basic";
      } else {
        isFinish = true;
      }
    }
  }

  function setUsername(user: string) {
    username = user;
  }

  function initDots(n_steps: number) {
    for (let index = 0; index < n_steps; index++) {
      dots.push({
        finishedBasic: false,
        isCorrectBasic: false,
        isFinished: false,
        isCorrect: false,
      });
    }
  }

  async function fetchPrediction(datapointId: number) {
    isLoadingPrediction = true;
    errorPrediction = null;

    try {
      const response = await getPrediction(datapointId);
      post = response;
    } catch (err) {
      errorPrediction =
        err instanceof Error ? err.message : "Failed to load visual";
      console.error("Error fetching visual:", err);
    } finally {
      isLoadingPrediction = false;
    }
  }

  onMount(() => {
    fetchPrediction(datapointId);
    console.log("mounted");
    console.log(steps);
    initDots(steps.length);
  });

  // Re-fetch when props change
  $: {
    if (datapointId) {
      fetchPrediction(datapointId);
    }
  }
</script>

<main>
  {#if username === ""}
    <Login {setUsername} />
  {:else}
    <div>
      <Manage
        {isFinish}
        {dots}
        {toNext}
        showDecision={!isFinish && substep !== "survey"}
      />
      <div class="pb-4 flex flex-col items-center relative">
        {#if substep === "basic"}
          <Basic
            {post}
            error={errorPrediction}
            isLoading={isLoadingPrediction}
          />
        {:else if isFinish}
          <div class="flex justify-center items-center">
            <p class="m-12">Excellent. Thanks for participating :-)</p>
          </div>
        {:else if currentStep.type === "dashboard"}
          {#if substep === "analysis"}
            <div class="flex flex-row items-center gap-4 flex-wrap justify-center">
              <BasicPopover
                {post}
                error={errorPrediction}
                isLoading={isLoadingPrediction}
              />
              <Dashboard {datapointId} {username} />
            </div>
          {:else}
            <Survey uiType="dashboard" {toNext} {username} {datapointId} />
          {/if}
        {:else if currentStep.type === "simple"}
          {#if substep === "analysis"}
            <ConvXaiLayout
              {post}
              error={errorPrediction}
              isLoading={isLoadingPrediction}
              {username}
              {datapointId}
              port="8765"
              doubleAssessment={false}
              interaction={false}
            />
          {:else}
            <Survey uiType="advanced" {toNext} {username} {datapointId} />
          {/if}
        {:else if currentStep.type === "double_assessment"}
          {#if substep === "analysis"}
            <ConvXaiLayout
              {post}
              error={errorPrediction}
              isLoading={isLoadingPrediction}
              {username}
              {datapointId}
              port="8765"
              doubleAssessment={true}
              interaction={false}
            />
          {:else}
            <Survey
              uiType="double_assessment"
              {toNext}
              {username}
              {datapointId}
            />
          {/if}
        {:else if currentStep.type === "interactive"}
          {#if substep === "analysis"}
            <ConvXaiLayout
              {post}
              error={errorPrediction}
              isLoading={isLoadingPrediction}
              {username}
              {datapointId}
              port="8765"
              doubleAssessment={false}
              interaction={true}
            />
          {:else}
            <Survey uiType="interactive" {toNext} {username} {datapointId} />
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</main>
