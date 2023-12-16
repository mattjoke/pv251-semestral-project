import {writable} from "svelte/store";
import {LoadingState} from "$lib/objects/loadingState.ts";
import {createFsFromVolume, Volume} from "memfs";
import {CurrentCommitDataHolder} from "$lib/objects/CurrentCommitDataHolder.ts";


export const repoStore = writable("");
export const dataLoadingState = writable(LoadingState.SUCCESS);
export const chartStore = writable({});

export const filesystemStore = writable(createFsFromVolume(new Volume()));
export const dataStore = writable(new CurrentCommitDataHolder());
export const selectedCommitsStore = writable([0, 10]);