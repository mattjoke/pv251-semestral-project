import {writable} from "svelte/store";
import {LoadingState} from "$lib/objects/loadingState.ts";


export const repoStore = writable("");
export const dataLoadingState = writable(LoadingState.SUCCESS);
export const dataStore = writable({});

export const chartStore = writable({});
