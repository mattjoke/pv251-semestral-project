<script lang="ts">
    import {echarts} from '$lib/utils.js';
    import {dataStore, selectedCommitsStore} from "$lib/stores/stores.js";
    import {getDefaultChartOption} from "$lib/utils.js";
    import prettyBytes from "pretty-bytes";

    export let width: number;
    export let height: number;

    let data = {};
    dataStore.subscribe((value) => {
        if (!value) {
            return;
        }
        data = value.data.tree;
        selectedCommitsStore.set(value.commits.slice(0, 10));
    });
    let commitTimeline = [];
    selectedCommitsStore.subscribe((value) => {
        if (!value) {
            return;
        }
        commitTimeline = value.map((item) => {
            return {
                value: item.oid.substring(0, 10),
                tooltip: {
                    formatter: (params) => {
                        return `Commit: ${item.oid.substring(0, 10)}<br/>Author: ${item.commit.author.name}<br/>Date: ${new Date(item.commit.author.timestamp * 1000)}<br/>Message: ${item.commit.message.replace(/(?:\r\n|\r|\n)/g, '<br/>')}`;
                    }
                }
            }
        });
    });

    let inside = {
        saveToStore: true,
        option: {
            timeline: {
                axisType: 'category',
                data: commitTimeline,
                left: '1%',
                right: '1%',
            },
            nodeGap: 50,
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: (params) => {
                    return `${params.data.name}: `+ prettyBytes(params.data.value || 0);
                }
            },
            title: {
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
            ]
        }
    }
</script>

<div style={`width: ${width}px; height: ${height}px;`}
     use:echarts={inside}/>

