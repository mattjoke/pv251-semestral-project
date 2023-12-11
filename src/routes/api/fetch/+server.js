import {dataLoadingState, dataStore} from "$lib/stores/stores.js";
import {LoadingState} from "$lib/objects/loadingState";
import {json} from "@sveltejs/kit";
import data from "$lib/data/perun.json"

export async function GET(event) {
    console.log("Fetching data from file");
    dataLoadingState.set(LoadingState.LOADED);
    dataStore.set(data);
    // await readFile('static/data/perun.json', 'utf8', (err, data) => {
    //     if (err) {
    //         dataLoadingState.set(LoadingState.ERROR);
    //         return json({process: "ERROR", error: err});
    //     }
    // });
    return json({process: "OK"});
}