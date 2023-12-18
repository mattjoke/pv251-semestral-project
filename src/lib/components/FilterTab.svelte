<script>

    import ProgressBar from "$lib/components/ProgresBar.svelte";
    import {chartStore, dataStore, filterStore} from "$lib/stores/stores.js";
    import {mapValuesToPercentage, stringToColour} from "$lib/utils.js";

    let selectedFilters = [];
    filterStore.subscribe(value => {
        selectedFilters = value;
    })

    let chartInstance = null;
    chartStore.subscribe(value => {
        chartInstance = value;
    });

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

    // $: console.log(selectedFilters)

    const handleClick = (i) => {
        filterStore.update(value => {
            if (value.includes(filters[i])) {
                return value.filter(item => item !== filters[i])
            } else {
                return [...value, filters[i]]
            }
        })
    }

    const handleCustomClick = () => {
        // Toggle between 'file', 'directory' and 'none' value
        const containsFile = selectedFilters.some(item => item.name === 'file');
        const containsDirectory = selectedFilters.some(item => item.name === 'directory');

        if (containsFile) {
            // Remove file and add directory
            filterStore.update(value => {
                return value.filter(item => item.name !== 'file')
            })
            filterStore.update(value => {
                return [...value, {name: 'directory'}]
            })
        } else if (containsDirectory) {
            // Remove directory and add none
            filterStore.update(value => {
                return value.filter(item => item.name !== 'directory')
            })
            filterStore.update(value => {
                return [...value]
            })
        } else {
            filterStore.update(value => {
                return [...value, {name: 'file'}]
            })
        }
    }
</script>


<div class="flex flex-col mt-3 h-2/3">
    <h1 class="text-2xl text-gray-700">
        Filters
    </h1>
    <div class="overflow-y-auto">
        <ProgressBar percentage={mapValuesToPercentage(stats.files, stats.directory)} rightColor="#FACA15"
                     rightTitle="Folders" leftTitle="Files" leftColor="#0E9F6E" id="file-bar" on:click={() => handleCustomClick()} specialBar={true}/>
        <div class="w-full flex flex-row justify-between -mt-3">
            <div class="mb-1 text-base font-medium">{stats.files}</div>
            <div class="mb-1 text-base font-medium">{stats.directory}</div>
        </div>
        <div class="w-full border-[0.5px] border-gray-300"></div>
        <div class="hover:text-gray-500 mt-3">
            {#each filters as filter,i}
                {#if selectedFilters.includes(filter)}
                    <div class="underline font-extrabold">
                        <ProgressBar percentage={filter.percentage} leftColor={filter.color} rightTitle="{filter.value}"
                                     leftTitle=".{filter.name}" id="pb-{i}" on:click={() => handleClick(i)}/>
                    </div>
                {:else}
                    <ProgressBar percentage={filter.percentage} leftColor={filter.color} rightTitle="{filter.value}"
                                 leftTitle=".{filter.name}" id="pb-{i}" on:click={() => handleClick(i)}/>
                {/if}
            {/each}
        </div>
    </div>
</div>
