<script>
    import {echarts} from '$lib/utils.js';
    import {dataStore} from "$lib/stores/stores.js";

    export let width = 400;
    export let height = 400;
    export let data = [
        {value: 1, name: 'Search Engine'},
        {value: 1, name: 'Direct'},
        {value: 1, name: 'Email'},
        {value: 0, name: 'Union Ads'},
        {value: 1, name: 'Video Ads'}
    ];

    dataStore.subscribe((value) => {
        // TODO: update data from CurrentDataStore
        const statData = value.stats[0];
        data = Object.keys(statData).filter(item => item !== 'files' && item !== 'directory' && item !== 'total' && item !== 'noExtension').map((key) => {
            return {
                value: statData[key],
                name: key
            }
        });
    })

    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: false
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 10,
                    borderWidth: 5
                },
                label: {
                    show: true,
                },
                labelLine: {
                    show: false
                },
                data: [...data]
            }
        ]
    };

</script>

<div class="flex flex-col justify-center items-center">
    <div style={`width: ${width}px; height: ${height}px;`}
         use:echarts={option}/>
    <p class="text-xl">File types</p>
</div>

