<script>
    import {chartStore} from "$lib/stores/stores.js";
    import {GraphStyle} from "$lib/objects/GraphStyle";
    import {clamp, prettierEnum} from "$lib/utils.js";

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
        switch (insideValue) {
            case 'TREE':
                newOption = {
                    series: {
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'vertical',
                        label: {
                            position: 'top',
                            rotate: 0,
                        }
                    }
                };
                break;
            case 'TREE_VERTICAL':
                newOption = {
                    series: {
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'horizontal',
                        label: {
                            position: 'top',
                            rotate: 0,
                        }
                    }
                };
                break;
            case 'RADIAL_TREE':
                newOption = {
                    series: {
                        type: 'tree',
                        layout: 'radial'
                    }
                };
                break;
            case 'TREE_MAP':
                newOption = {
                    series: {
                        type: 'treemap',
                        layoutAlgorithm: 'squarified',
                        visibleMin: 300,
                    }
                };
                break;
            case 'DAG':
                newOption = {
                    series: {
                        type: 'graph',
                        layout: 'none',
                        data: [{
                            name: 'Node 1',
                            x: 300,
                            y: 300,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }, {
                            name: 'Node 2',
                            x: 800,
                            y: 300,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }, {
                            name: 'Node 3',
                            x: 550,
                            y: 100,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }, {
                            name: 'Node 4',
                            x: 550,
                            y: 500,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }],
                        edges: [{
                            source: 0,
                            target: 1
                        }, {
                            source: 1,
                            target: 2
                        }, {
                            source: 2,
                            target: 3
                        }]
                    }
                };
                break;
            case 'FORCE_DIRECTED':
                newOption = {
                    series: {
                        type: 'graph',
                        layout: 'force',
                        data: [{
                            name: 'Node 1',
                            x: 300,
                            y: 300,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }, {
                            name: 'Node 2',
                            x: 800,
                            y: 300,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }, {
                            name: 'Node 3',
                            x: 550,
                            y: 100,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }, {
                            name: 'Node 4',
                            x: 550,
                            y: 500,
                            symbolSize: 20,
                            itemStyle: {
                                color: '#2c7be5'
                            }
                        }],
                        edges: [{
                            source: 0,
                            target: 1
                        }, {
                            source: 1,
                            target: 2
                        }, {
                            source: 2,
                            target: 3
                        }]
                    }
                };
                break;
        }


        chartInstance.setOption(newOption, false, true);
    }

    let inputCounter = 1;
    const updateCounter = (value) => {
        inputCounter = clamp(inputCounter + value, 1, 999);

        if (chartInstance == null) {
            return;
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
