<script>
    import {echarts} from '$lib/utils.js';

    export let width = 400;
    export let height = 400;
    export let data = [
        {value: 1, name: 'Search Engine'},
        {value: 1, name: 'Direct'},
        {value: 1, name: 'Email'},
        {value: 0, name: 'Union Ads'},
        {value: 1, name: 'Video Ads'}
    ];

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

