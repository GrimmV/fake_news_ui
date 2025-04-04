<script lang="ts">

    import Visual from "./Visual.svelte";

    export let modules = [
        {
            name: "feature distribution",
            params: {
                label: 0,
                feature_name: "Length"
            }
        },
        {
            name: "individual feature importance",
            params: {}
        },
        {
            name: "global feature importance",
            params: {
                label: 0
            }
        }
    ]

</script>

<div class="flex flex-wrap">
    {#each modules as my_module}
        <Visual module={my_module.name} params={my_module.params} />
    {/each}
</div>