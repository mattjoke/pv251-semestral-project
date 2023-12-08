<script lang="ts">
    import TreePlot from "$lib/components/plots/common/TreePlot.svelte";

    let width = window.innerWidth * 0.7;
    let height = window.innerHeight * 0.8;
    let state = false;

    $: {
    }
</script>


<div class="w-full h-full overflow-hidden" bind:clientWidth={width} bind:clientHeight={height}>
    <TreePlot width={width} height={height} radial={false}/>
</div>
