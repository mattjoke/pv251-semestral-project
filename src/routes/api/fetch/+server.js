import {filesystemStore} from "$lib/stores/stores.js";
import {json} from "@sveltejs/kit";
import {createFsFromVolume, Volume} from "memfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import {CurrentCommitDataHolder} from "$lib/objects/CurrentCommitDataHolder.ts";

export async function GET(event) {
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    const cache = {};
    filesystemStore.set(fs);

    let commits;
    try {

        await git.clone({
            fs,
            http,
            dir: "/",
            url: "https://github.com/mattjoke/deep-neural-network.git",
            ref: "main",
            cache: cache
        });

        commits = await git.log({
            fs,
            dir: "/",
            ref: "main",
            cache: cache
        });
    } catch (e) {
        await git.clone({
            fs,
            http,
            dir: "/",
            url: "https://github.com/mattjoke/deep-neural-network.git",
            ref: "master",
            cache: cache
        });

        commits = await git.log({
            fs,
            dir: "/",
            ref: "master",
            cache: cache
        });
    }

    const data = await CurrentCommitDataHolder.generateCurrentCommitDataHolder(fs, cache, commits);
    return json({message: "OK", data: data});
}