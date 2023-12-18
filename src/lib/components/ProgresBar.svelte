<script>
    import {tweened} from "svelte/motion";
    import {quadInOut} from "svelte/easing";
    import {Popover} from "flowbite-svelte";
    import {filterStore} from "$lib/stores/stores.js";

    export let id = "";
    export let percentage = 0;
    export let leftColor = 'blue';
    export let rightColor = '#F3F4F6';
    export let specialBar = false;

    export let leftTitle = 'Left Title';
    export let rightTitle = 'Right Title';

    const progress = tweened(0, {
        duration: 500,
        easing: quadInOut,
        delay: 500
    });

    $: progress.set(percentage);

    let filters = [];
    filterStore.subscribe(value => {
        filters = value;
    });
    $: containsFolder = filters.filter(item => item.name === "directory").length > 0;
    $: containsFile = filters.filter(item => item.name === "file").length > 0;

    // console.log(containsFolder, containsFile, "OK");
</script>

<div class="group cursor-pointer" id="filter-{id}" on:click on:keypress role="button" tabindex="0">
    <div class="w-full flex flex-row justify-between group-hover:text-black">
        <div class="mb-1 font-medium">{leftTitle}</div>
        <div class="mb-1 font-medium {rightTitle === 'Right Title' ? 'invisible' : 'visible'}">{rightTitle}</div>
    </div>
    <div class="w-full flex flex-row rounded-full h-2.5 mb-4">
        <div class="h-2.5 rounded-l-lg {rightTitle === 'Right Title' ? 'rounded-r-lg' : '' } hover:scale-105 cursor-pointer transition-transform"
             style:width="{$progress}%" style:background-color="{leftColor}"
        />
        <div class="h-2.5 rounded-r-lg transition-transform cursor-pointer"
             id="{rightTitle === 'Right Title' ? '' : 'right'}" style:width="{100 - $progress}%"
             style:background-color="{rightColor}"
        ></div>
    </div>
</div>
<Popover target="filter-{id}" placement="left" trigger="hover">
    {#if specialBar}
        Click to highlight (toggle to {containsFile ? 'Folder' : containsFolder ? 'All' : 'File'})
    {:else}
        Click to highlight
    {/if}
</Popover>
