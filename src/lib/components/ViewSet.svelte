<script>
    import {chartStore, dataStore} from "$lib/stores/stores.js";
    import {GraphStyle} from "$lib/objects/GraphStyle";
    import {getDefaultChartOption, prettierEnum} from "$lib/utils.js";
    import GraphDepth from "$lib/components/GraphDepth.svelte";
    import prettyBytes from "pretty-bytes";

    let chartInstance = null;
    chartStore.subscribe((value) => {
        chartInstance = value;
    });

    let viewOption = Object.values(GraphStyle).map((style) => {
        return {
            name: prettierEnum(style),
            value: false,
            insideValue: style
        }
    });
    viewOption[0].value = true;
    let graphDepthActive = true;

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
                graphDepthActive = true;
                inputCounter = 1;
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'vertical',
                        data: [data],
                        tooltip: {
                            formatter: (params) => {
                                return `${params.data.name}: `+ prettyBytes(params.data.value);
                            }
                        },
                        label: {
                            position: 'bottom',
                            rotate: 0,
                        }
                    })
                };
                break;
            case 'TREE_VERTICAL':
                graphDepthActive = true;
                inputCounter = 1;
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'horizontal',
                        data: [data],
                        tooltip: {
                            formatter: (params) => {
                                return `${params.data.name}: `+ prettyBytes(params.data.value);
                            }
                        },
                        label: {
                            position: 'right',
                            rotate: 0,
                        }
                    })
                };
                break;
            case 'RADIAL_TREE':
                graphDepthActive = true;
                inputCounter = 1;
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        type: 'tree',
                        layout: 'radial',
                        data: [data],
                        tooltip: {
                            formatter: (params) => {
                                return `${params.data.name}: `+ prettyBytes(params.data.value);
                            }
                        },
                        label: {
                            position: 'bottom',
                            distance: 10,
                            rotate: 0,
                        }
                    })
                };
                break;
            case 'TREE_MAP':
                graphDepthActive = false;
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
                graphDepthActive = false;
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
                graphDepthActive = false;
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
            case 'CIRCULAR_GRAPH':
                graphDepthActive = false;
                data = commitInstance.data.dag ?? [];
                newOption = {
                    series: getDefaultChartOption(
                        {
                            type: 'graph',
                            layout: 'circular',
                            data: data.nodes,
                            links: [...data.links],
                            emphasis: {
                                focus: 'adjacency',
                                edgeLabel: {
                                    show: true,
                                    fontSize: 20,
                                }
                            },
                            draggable: true,
                            label: {
                                show: true,
                                position: 'bottom',
                                rotate: 0,
                            },
                            symbol: (value, params) => {
                                return 'circle';
                            },
                        }
                    )
                };
                break;
        }

        chartInstance.setOption(newOption, false, true);
    }

    let inputCounter = 1;
    $: {
        if (chartInstance != null) {
            let newOption = {
                series: {
                    initialTreeDepth: inputCounter
                }
            };
            chartInstance.setOption(newOption, false, true);
        }
    }
</script>


<div class="mb-5">
    <h1 class="text-2xl">
        View options
    </h1>
    <p class="text-xl mt-5">Graph type</p>
    <div class="flex flex-col rounded-md shadow-sm w-full" role="group">
        {#each viewOption as option, i}
            <button type="button" on:click={() => handleClick(i, option.insideValue)}
                    class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 {option.value ? 'bg-blue-200':''}">
                {option.name}
            </button>
        {/each}
    </div>
    <GraphDepth bind:depth={graphDepthActive} bind:counter={inputCounter}/>
</div>
