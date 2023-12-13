import {chartStore} from "$lib/stores/stores.js";
import * as charts from 'echarts';

export const isInvalidLink = (link) => {
    const regex = /https?:\/\/[^\s$.?#].\S*$/gm;
    return link === undefined || link === null || link === '' || !regex.test(link);
}

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
}

export const prettierEnum = (str) => {
    let prettyString = str.toString().toLowerCase();
    prettyString = prettyString.replace('_', ' ');
    return prettyString.split(' ').map(capitalize).join(' ');
}

export const convertStateIdToName = (stateId) => {
    switch (stateId) {
        case 0:
            return "Loading";
        case 1:
            return "Loaded";
        case 2:
            return "Processing";
        case 3:
            return "Success";
        case 4:
            return "Error";
        case 5:
            return "No Information";
        default:
            return "Unknown state";
    }
}


export function echarts(node, option) {
    if (option.saveToStore) {
        echartsSave(node, option.option, true);
        return;
    }
    const chart = charts.init(node);
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

export function echartsSave(node, option, saveToStore = false) {
    const chart = charts.init(node);
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    if (saveToStore) {
        chartStore.set(chart);
    }
}

export const getDefaultChartOption = (object) => {
    const opts = {
        left: '10%',
        right: '10%',

        roam: true,
        label: {
            position: 'bottom',
            fontSize: 15
        },
        symbolSize: 10,
        symbol: (value, params) => {
            if (value != null) {
                return 'path://M21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V11.92Zm-.3,2.49,6,5.9h-6ZM8,30V6H20v8h8V30Z';
            }
            return 'path://M21,8V19a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V5A1,1,0,0,1,4,4H9.59a1,1,0,0,1,.7.29l2.42,2.42a1,1,0,0,0,.7.29H20A1,1,0,0,1,21,8Z';
        },
        initialTreeDepth: 1,
        itemStyle: {
            color: 'orange',
            borderWidth: 1,
            borderColor: '#333'
        },
        emphasis: {
            focus: 'relative'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mouseclick'

        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
    };

    return Object.assign(opts, object);

}