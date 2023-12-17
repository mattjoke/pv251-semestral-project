<script>
    import {chartStore, dataStore, selectedCommitsStore} from "$lib/stores/stores.js";
    import {GraphStyle} from "$lib/objects/GraphStyle";
    import {getDefaultChartOption, prettierEnum} from "$lib/utils.js";
    import GraphDepth from "$lib/components/GraphDepth.svelte";
    import prettyBytes from "pretty-bytes";
    import CommitChooser from "$lib/components/CommitChooser.svelte";

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

    let currentGraphType = GraphStyle.TREE;
    let inputCounter = 1;

    let commitInstance = null;
    let allCommits;
    dataStore.subscribe((value) => {
        commitInstance = value;
        allCommits = value.commits;
    });

    let selectedCommits;
    selectedCommitsStore.subscribe((value) => {
        selectedCommits = value;
    });

    $: pickedCommits = allCommits.slice(selectedCommits[0], selectedCommits[1]);
    $: timelineCommits = pickedCommits.map((item) => {
        return {
            value: item.oid.substring(0, 10),
            tooltip: {
                formatter: (params) => {
                    return `Commit: ${item.oid.substring(0, 10)}<br/>Author: ${item.commit.author.name}<br/>Date: ${new Date(item.commit.author.timestamp * 1000)}<br/>Message: ${item.commit.message.replace(/(?:\r\n|\r|\n)/g, '<br/>')}`;
                }
            }
        }
    });

    const updateGraphOptions = (insideValue) => {
        let newOption = {};
        let data = [];

        switch (insideValue) {
            case 'TREE':
                graphDepthActive = true;
                currentGraphType = GraphStyle.TREE;
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        initialTreeDepth: inputCounter,
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'vertical',
                        data: [data],
                        tooltip: {
                            formatter: (params) => {
                                return `${params.data.name}: ` + prettyBytes(params.data.value);
                            }
                        },
                        label: {
                            position: 'bottom',
                            rotate: 0,
                        }
                    }),
                };
                break;
            case 'TREE_VERTICAL':
                graphDepthActive = true;
                currentGraphType = GraphStyle.TREE_VERTICAL;
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        initialTreeDepth: inputCounter,
                        type: 'tree',
                        layout: 'orthogonal',
                        orient: 'horizontal',
                        data: [data],
                        tooltip: {
                            formatter: (params) => {
                                return `${params.data.name}: ` + prettyBytes(params.data.value);
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
                currentGraphType = GraphStyle.RADIAL_TREE;
                data = commitInstance.data.tree ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        initialTreeDepth: inputCounter,
                        type: 'tree',
                        layout: 'radial',
                        data: [data],
                        tooltip: {
                            formatter: (params) => {
                                return `${params.data.name}: ` + prettyBytes(params.data.value);
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
                currentGraphType = GraphStyle.TREE_MAP;
                data = commitInstance.data.treeMap ?? [];
                newOption = {
                    series: getDefaultChartOption({
                        initialTreeDepth: inputCounter,
                        type: 'treemap',
                        visibleMin: 300,
                        label: {
                            show: true,
                            formatter: '{b}'
                        },
                        upperLabel: {
                            show: true,
                            height: 30
                        },
                        itemStyle: {
                            borderColor: '#fff'
                        },
                        levels: [
                            {
                                itemStyle: {
                                    borderColor: '#777',
                                    borderWidth: 0,
                                    gapWidth: 1
                                },
                                upperLabel: {
                                    show: false
                                }
                            },
                            {
                                itemStyle: {
                                    borderColor: '#555',
                                    borderWidth: 5,
                                    gapWidth: 1
                                },
                            },
                            {
                                colorSaturation: [0.35, 0.5],
                                itemStyle: {
                                    borderWidth: 5,
                                    gapWidth: 1,
                                    borderColorSaturation: 0.6
                                }
                            }
                        ],
                        data: [data]
                    })
                };
                break;
            case 'DAG':
                graphDepthActive = false;
                currentGraphType = GraphStyle.DAG;
                data = commitInstance.data.dag ?? [];
                newOption = {
                    series: getDefaultChartOption(
                        {
                            initialTreeDepth: inputCounter,
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
                currentGraphType = GraphStyle.FORCE_DIRECTED;
                data = commitInstance.data.dag ?? [];
                newOption = {
                    series: getDefaultChartOption(
                        {
                            initialTreeDepth: inputCounter,
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
                                repulsion: 1000,
                                layoutAnimation: true,
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
                currentGraphType = GraphStyle.CIRCULAR_GRAPH;
                data = commitInstance.data.dag ?? [];
                newOption = {
                    series: getDefaultChartOption(
                        {
                            initialTreeDepth: inputCounter,
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
        return newOption;
    }

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
        let newOption = updateGraphOptions(insideValue);
        chartInstance.setOption(newOption, false, true);
    }

    $: {
        if (chartInstance != null) {
            chartInstance.setOption({
                series: {
                    initialTreeDepth: inputCounter,
                }
            }, false, true);
        }
    }

    $: {
        if (chartInstance != null) {
            let commitFS = commitInstance.commitFS ?? {};
            let computedCommitFS = Object.keys(commitFS).filter((item) => {
                // Check if the commit is in the picked commits
                return pickedCommits.some((commit) => {
                    return commit.oid === item;
                });
            });

            const updateOption = {
                timeline: {
                    data: timelineCommits ?? [],
                },
                options: computedCommitFS.map((key) => {
                    let d = commitFS[key].data.tree;

                    let newData = [];
                    let newLinks = [];
                    if (currentGraphType === GraphStyle.TREE_MAP) {
                        d = commitFS[key].data.treeMap;
                        newData = [d];
                    } else if (currentGraphType === GraphStyle.DAG || currentGraphType === GraphStyle.FORCE_DIRECTED || currentGraphType === GraphStyle.CIRCULAR_GRAPH) {
                        d = commitFS[key].data.dag;
                        newData = d.nodes;
                        newLinks = [...d.links];
                    } else {
                        newData = [d];
                    }

                    return {
                        title: {
                            text: key
                        },
                        series: {
                            levels: [
                                {
                                    itemStyle: {
                                        borderColor: '#777',
                                        borderWidth: 0,
                                        gapWidth: 1
                                    },
                                    upperLabel: {
                                        show: false
                                    }
                                },
                                {
                                    itemStyle: {
                                        borderColor: '#555',
                                        borderWidth: 5,
                                        gapWidth: 1
                                    },
                                },
                                {
                                    colorSaturation: [0.35, 0.5],
                                    itemStyle: {
                                        borderWidth: 5,
                                        gapWidth: 1,
                                        borderColorSaturation: 0.6
                                    }
                                }
                            ],
                            data: newData,
                            links: newLinks,
                        }
                    }
                }),
            }
            chartInstance.setOption(updateOption, false, true);
        }
    }
</script>


<div class="mb-5">
    <h1 class="text-2xl">
        View options
    </h1>
    <CommitChooser/>
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
