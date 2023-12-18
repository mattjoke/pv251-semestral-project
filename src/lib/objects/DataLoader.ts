import {createFsFromVolume, Volume} from "memfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import {json} from "@sveltejs/kit";
import {CurrentCommitDataHolder} from "./CurrentCommitDataHolder";

export const fetchData = async (url: string, branch: string, commitLimit: number) => {
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    const cache = {};

    const limit = commitLimit !== -1 ? commitLimit : undefined;
    let commits;
    try {
        await git.clone({
            fs,
            http,
            dir: "/",
            url: url,
            ref: branch,
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
            depth: limit,
            cache: cache
        });
    } catch (e) {
        return json({message: "NOK", data: []})
    }

    const data = await CurrentCommitDataHolder.generateCurrentCommitDataHolder(fs, cache, commits);
    await data.generateCommitFSWithHistory();
    return json({message: "OK", data: data});
}