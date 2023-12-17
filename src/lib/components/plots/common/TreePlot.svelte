<script lang="ts">
    import {echarts, getDefaultChartOption} from '$lib/utils.js';
    import {dataStore} from "$lib/stores/stores.js";
    import prettyBytes from "pretty-bytes";

    export let width: number;
    export let height: number;

    let data = {};
    let allCommits = [];
    dataStore.subscribe((value) => {
        if (!value) {
            return;
        }
        data = value.data.tree;
        allCommits = value.commits;
    });


    let inside = {
        saveToStore: true,
        option: {
            timeline: {
                axisType: 'category',
                inverse: true,
                data: [],
                left: '1%',
                right: '1%',
            },
            nodeGap: 50,
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: (params) => {
                    return `${params.data.name}: ` + prettyBytes(params.data.value || 0);
                }
            },
            title: {
                text: "Placeholder",
                subtext: "Placeholder",
                left: 'center'
            },
            series: [
                getDefaultChartOption(
                    {
                        type: 'tree',
                        orient: "vertical",
                        layout: 'orthogonal',
                        data: [data],
                    }
                )
            ],
        }
    }
</script>

<div style={`width: ${width}px; height: ${height}px;`}
     use:echarts={inside}/>

