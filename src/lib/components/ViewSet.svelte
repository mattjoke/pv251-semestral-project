<script>
    import {chartStore, dataStore} from "$lib/stores/stores.js";
    import {GraphStyle} from "$lib/objects/GraphStyle";
    import {clamp, getDefaultChartOption, prettierEnum} from "$lib/utils.js";

    let chartInstance = null;
    chartStore.subscribe((value) => {
        chartInstance = value;
    });

    let viewOption = Object.values(GraphStyle).map((style) => {
        console.log(style);
        return {
            name: prettierEnum(style),
            value: false,
            insideValue: style
        }
    });
    viewOption[0].value = true;

    let commitInstance = null;
    dataStore.subscribe((value) => {
        commitInstance = value;
    });

    const handleClick = (i, insideValue) => {
        viewOption = viewOption.map((option, index) => {
            if (index === i) {
                return {
                    ...option,
                    value: true
                }
            } else {
                return {
                    ...option,
                    value: false
                }
            }
        });

        if (chartInstance == null) {
            return;
        }
        let newOption = {};
        let data = [];
        switch (insideValue) {
            case 'TREE':
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'vertical',
                        data: [data],
                        label: {
                            position: 'bottom',
                            rotate: 0,
                        }
                    })
                };
                break;
            case 'TREE_VERTICAL':
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'horizontal',
                        data: [data],
                        label: {
                            position: 'right',
                            rotate: 0,
                        }
                    })
                };
                break;
            case 'RADIAL_TREE':
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        type: 'tree',
                        layout: 'radial',
                        data: [data],
                        label: {
                            position: 'bottom',
                            distance: 10,
                            rotate: 0,
                        }
                    })
                };
                break;
            case 'TREE_MAP':
                newOption = {
                    series: getDefaultChartOption({
                        type: 'treemap',
                        data: [data],
                        layoutAlgorithm: 'squarified',
                        visibleMin: 300,
                    })
                };
                break;
            case 'DAG':
                data = commitInstance.data.dag ?? [];
                newOption = {
                    series: getDefaultChartOption(
                        {
                            type: 'graph',
                            layout: 'none',
                            data: data.nodes,
                            links: data.links,
                            draggable: true,
                            emphasis: {
                                focus: 'adjacency',
                                edgeLabel: {
                                    show: true,
                                    fontSize: 20,
                                }
                            },
                            label: {
                                show: true,
                                position: 'bottom',
                                rotate: 0,
                            }
                        }
                    )
                };
                break;
            case 'FORCE_DIRECTED':
                data = commitInstance.data.dag ?? [];
                newOption = {
                    series: getDefaultChartOption(
                        {
                            type: 'graph',
                            layout: 'force',
                            data: data.nodes,
                            links: [...data.links],
                            emphasis: {
                                focus: 'adjacency',
                                edgeLabel: {
                                    show: true,
                                    fontSize: 20,
                                }
                            },
                            force: {
                                repulsion: 200,
                                edgeLength: 1,
                            },
                            draggable: true,
                            label: {
                                show: true,
                                position: 'bottom',
                                rotate: 0,
                            }
                        }
                    )
                };
                break;
        }

        chartInstance.setOption(newOption, false, true);
    }

    let inputCounter = 1;
    const updateCounter = (value) => {
        inputCounter = clamp(inputCounter + value, 1, 999);

        if (chartInstance == null) {
            return;sy
        }
        let newOption = {
            series: {
                initialTreeDepth: inputCounter
            }
        };
        chartInstance.setOption(newOption, false, true);
    }
</script>


<div class="mb-5">
    <p class="text-xl mt-5">Graph type</p>
    <div class="flex flex-col rounded-md shadow-sm w-full" role="group">
        {#each viewOption as option, i}
            <button type="button" on:click={() => handleClick(i, option.insideValue)}
                    class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 {option.value ? 'bg-blue-200':''}">
                {option.name}
            </button>
        {/each}
    </div>
    <p class="text-xl mt-5">Graph depth</p>
    <div class="flex flex-row w-full justify-center">
        <div class="relative flex items-center max-w-[8rem]">
            <button type="button" id="decrement-button" on:click={()=>updateCounter(-1)}
                    class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M1 1h16"/>
                </svg>
            </button>
            <input type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation"
                   class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   bind:value={inputCounter} required>
            <button type="button" id="increment-button" on:click={()=>updateCounter(1)}
                    class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 1v16M1 9h16"/>
                </svg>
            </button>
        </div>
    </div>
</div>
