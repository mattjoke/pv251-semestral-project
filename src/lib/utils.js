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