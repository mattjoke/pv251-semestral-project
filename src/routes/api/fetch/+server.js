import {filesystemStore} from "$lib/stores/stores.js";
import {json} from "@sveltejs/kit";
import {createFsFromVolume, Volume} from "memfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import {CurrentCommitDataHolder} from "$lib/objects/CurrentCommitDataHolder.ts";

export async function POST({request}) {
    const body = await request.json();
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    const cache = {};
    filesystemStore.set(fs);

    const url = body.repoLink;
    const branch = body.branch;
    const commitLimit = body.commits !== -1 ? body.commits : undefined;

    let commits;
    try {
        await git.clone({
            fs,
            http,
            dir: "/",
            url: url,
            ref: body.branch,
            cache: cache
        });
        await git.fetch({
            fs,
            http,
            dir: "/",
            ref: branch,
            cache: cache
        });
        commits = await git.log({
            fs,
            dir: "/",
            ref: branch,
            depth: commitLimit,
            cache: cache
        });
    } catch (e) {
        return json({message: "NOK", data: []})
    }

    const data = await CurrentCommitDataHolder.generateCurrentCommitDataHolder(fs, cache, commits);
    await data.generateCommitFSWithHistory();
    return json({message: "OK", data: data});
}
