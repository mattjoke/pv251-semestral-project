import {dataLoadingState, dataStore, filesystemStore} from "$lib/stores/stores.js";
import {LoadingState} from "$lib/objects/loadingState";
import {json} from "@sveltejs/kit";
import {createFsFromVolume, Volume} from "memfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import {CurrentCommitDataHolder} from "$lib/objects/CurrentCommitDataHolder.ts";

export async function GET(event) {
    console.log("Fetching data, from repository");
    dataLoadingState.set(LoadingState.LOADED);

    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    const cache = {};
    filesystemStore.set(fs);

    await git.clone({
        fs,
        http,
        dir: "/",
        url: "https://github.com/CESNET/perun-services.git",
        ref: "main",
        cache: cache
    });

    const data = await CurrentCommitDataHolder.generateCurrentCommitDataHolder(fs, cache);
    dataStore.set(data);
    return json({message: "OK", data: data});
}