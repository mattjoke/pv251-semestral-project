<script>

    import ProgressBar from "$lib/components/ProgresBar.svelte";
    import {dataStore} from "$lib/stores/stores.js";
    import {mapValuesToPercentage, numberToStringWithPrecision} from "$lib/utils.js";
    import {Popover} from "flowbite-svelte";

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
                percentage: mapValuesToPercentage(filterData[key], stats.files)
            }
        }).sort((a, b) => b.value - a.value)
    })
</script>


<div class="flex flex-col mt-3 h-1/2">
    <h1 class="text-2xl text-gray-700">
        Filters
    </h1>
    <!--    <Plot/>-->
    <ProgressBar percentage={mapValuesToPercentage(stats.files, stats.directory)} rightColor="yellow"
                 rightTitle="Folders" leftTitle="Files" leftColor="green"/>
    <div class="w-full flex flex-row justify-between -mt-3">
        <div class="mb-1 text-base font-medium">{stats.files}</div>
        <div class="mb-1 text-base font-medium">{stats.directory}</div>
    </div>

    <div class="hover:text-gray-500">
        {#each filters as filter,i}
            <ProgressBar percentage={filter.percentage} leftColor="blue" leftTitle=".{filter.name}" id="pb-{i}"/>
            <Popover class="w-64 text-sm font-light " triggeredBy="#pb-{i}">
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between">
                        <div class="text-base font-medium">File count '.{filter.name}'</div>
                        <div class="text-base font-medium">{filter.value}</div>
                    </div>
                    <div class="flex flex-row justify-between">
                        <div class="text-base font-medium">Percentage</div>
                        <div class="text-base font-medium">{numberToStringWithPrecision(filter.percentage, 2)}%</div>
                    </div>
                </div>
            </Popover>
        {/each}
    </div>
</div>
