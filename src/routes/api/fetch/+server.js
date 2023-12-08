import {readFile} from "fs";
import {dataLoadingState, dataStore} from "$lib/stores/stores.js";
import {LoadingState} from "$lib/objects/loadingState";
import {json} from "@sveltejs/kit";

export async function GET(event) {
    console.log("Fetching data from file");
    await readFile('static/data/perun.json', 'utf8', (err, data) => {
        if (err) {
            dataLoadingState.set(LoadingState.ERROR);
            return json({process: "ERROR", error: err});
        }
        dataLoadingState.set(LoadingState.LOADED);
        dataStore.set(JSON.parse(data));
    });
    return json({process: "OK"});
}