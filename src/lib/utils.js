import {chartStore} from "$lib/stores/stores.js";
import * as charts from 'echarts';
import {DIRECTORY, FILE} from "$lib/icons.js";

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
    // chart.on('timelinechanged', (params) => {
    //     )
    if (saveToStore) {
        chartStore.set(chart);
    }
}

export const getDefaultChartOption = (object) => {
    const opts = {
        left: '10%',
        right: '10%',
        data: [],
        roam: true,
        label: {
            position: 'bottom',
            fontSize: 15
        },
        symbolSize: 10,
        symbol: (value, params) => {
            if (params.data == null || params.data.children == null) return FILE;
            if (Object.keys(params.data.children).length === 0) {
                return FILE;
            }
            return DIRECTORY;
        },
        itemStyle: {
            color: '#FACA15',
            borderWidth: 1,
            borderColor: '#333'
        },
        emphasis: {
            focus: 'relative'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
    };

    return Object.assign(opts, object);

}


export const mapValuesToPercentage = (a, b) => {
    // a + b = 100%, return percentage of a
    return (a / (a + b)) * 100;
}

export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const numberToStringWithPrecision = (number, precision) => {
    return number.toFixed(precision);
}

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
export const stringToColour = (str) => {
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += value.toString(16).padStart(2, '0')
    }
    return colour
}

// Hash
export const hashCode = (str) => {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
    }
    return hash;
}

// Convert string to unique number id
export const stringToId = (str) => {
    return Math.abs(hashCode(str));
}
