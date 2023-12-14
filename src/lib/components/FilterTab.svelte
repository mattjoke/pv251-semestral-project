<script>

    import ProgressBar from "$lib/components/ProgresBar.svelte";
    import {dataStore} from "$lib/stores/stores.js";
    import {mapValuesToPercentage, stringToColour} from "$lib/utils.js";

    let stats;
    let filters = [
        {
            name: "Placeholder"
        }
    ];
    dataStore.subscribe(value => {
        stats = value.stats[0];
        const filterData = value.filters;
        filters = Object.keys(filterData).map(key => {
            return {
                name: key,
                value: filterData[key],
                percentage: mapValuesToPercentage(filterData[key], stats.files),
                color: stringToColour(key)
            }
        }).sort((a, b) => b.value - a.value)
    })

    const handleClick = (i) => {
        console.log("clicked", filters[i])
    }
</script>


<div class="flex flex-col mt-3 h-1/2">
    <h1 class="text-2xl text-gray-700">
        Filters
    </h1>
    <ProgressBar percentage={mapValuesToPercentage(stats.files, stats.directory)} rightColor="#FACA15"
                 rightTitle="Folders" leftTitle="Files" leftColor="#0E9F6E" id="file-bar"/>
    <div class="w-full flex flex-row justify-between -mt-3">
        <div class="mb-1 text-base font-medium">{stats.files}</div>
        <div class="mb-1 text-base font-medium">{stats.directory}</div>
    </div>

    <div class="w-full border-[0.5px] border-gray-300"></div>
    <div class="hover:text-gray-500 mt-3">
        {#each filters as filter,i}
            <ProgressBar percentage={filter.percentage} leftColor={filter.color} rightTitle="{filter.value}"
                         leftTitle=".{filter.name}" id="pb-{i}" on:click={() => handleClick(i)}/>
        {/each}
    </div>
</div>
