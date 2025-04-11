<script lang="ts">

    import Button from "../../lib/components/ui/button/button.svelte";

    export let toNext;

    let labelOptions = [
        {
            name: "False"
        },
        {
            name: "Neither"
        },
        {
            name: "True"
        }
    ]

</script>

<div class="flex gap-10 justify-center">
    {#each labelOptions as option}
        <Button on:click={() => toNext(option.name)}>{option.name}</Button>
    {/each}
</div>