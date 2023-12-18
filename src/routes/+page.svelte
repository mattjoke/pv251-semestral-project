<script>
    import SideBar from "$lib/components/SideBar.svelte";
    import MainContent from "$lib/components/MainContent.svelte";
    import {repoStore} from "$lib/stores/stores.js";
    import NoContent from "$lib/components/NoContent.svelte";

    let isGitRepo = false;

    repoStore.subscribe((value) => {
        // Display the main content only if the repo is valid
        isGitRepo = value != null && value !== "";
    });
</script>

<svelte:head>
    <link rel="icon" href="/logo.svg"/>
    <title>LogGit - Git History Crawler</title>
    <meta name="description" content="Git History Crawler"/>
</svelte:head>

<div class="grid grid-flow-row-dense grid-cols-4 h-full">
    {#if isGitRepo}
        <div class="col-span-3 h-full">
            <MainContent/>
        </div>
        <div class="flex flex-col flex-nowrap overflow-auto bg-gray-100">
            <SideBar/>
        </div>
    {:else}
        <div class="col-span-4 h-full">
            <NoContent/>
        </div>
    {/if}
</div>