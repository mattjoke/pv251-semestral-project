<script lang="ts">
    import TreePlot from "$lib/components/plots/common/TreePlot.svelte";

    let width = window.innerWidth * 0.7;
    let height = window.innerHeight * 0.7;
</script>


<div class="h-full w-full" bind:clientWidth={width} bind:clientHeight={height}>
    <TreePlot width={width} height={height}/>
</div>
