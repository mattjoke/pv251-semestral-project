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

    const url = "https://github.com/mattjoke/pv251-semestral-project.git"

    let commits;
    try {

        await git.clone({
            fs,
            http,
            dir: "/",
            url: url,
            ref: "main",
            cache: cache
        });

        await git.fetch({
            fs,
            http,
            dir: "/",
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
            url: url,
            ref: "master",
            cache: cache
        });

        await git.fetch({
            fs,
            http,
            dir: "/",
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
    await data.generateCommitFSWithHistory();
    return json({message: "OK", data: data});
}