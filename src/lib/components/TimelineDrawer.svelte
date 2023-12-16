<script>
    import TimelineItem from "$lib/components/TimelineItem.svelte";
    import {dataStore, selectedCommitsStore} from "$lib/stores/stores.js";

    let allCommits = [];
    dataStore.subscribe(value => {
        allCommits = value.commits;
    })

    let selectedCommits = [];
    selectedCommitsStore.subscribe(value => {
        const left = value[0];
        const right = value[1];
        selectedCommits = allCommits.slice(left, right).reverse()
    })
</script>

{#each selectedCommits as commit}
    <TimelineItem {commit}/>
{/each}