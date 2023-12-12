// await readFile('static/data/perun.json', 'utf8', (err, data) => {
//     if (err) {
//         dataLoadingState.set(LoadingState.ERROR);
//         return json({process: "ERROR", error: err});
//     }
// });
// const d = await git.readTree(
//     {
//         fs,
//         dir: "/",
//         oid: "eda23d81dca4516bdbbd0cfed35d2a604e36e43a",
//         cache: cache
//     }
// );


//
// import git from "isomorphic-git";
// import {json} from "@sveltejs/kit";
//
// const walker = await git.TREE({ref: "dca5b75b69fda5b3f0c0ab04f70161943b0b6dc1"})
// const d = await git.walk(
//     {
//         fs,
//         dir: "/",
//         trees: [walker],
//         map: async function (filepath, entries) {
//             return entries.map(function (entry) {
//                 return {
//                     mode: entry.mode,
//                     path: filepath,
//                     type: entry.type(),
//                     oid: entry.oid
//                 };
//             });
//         }
//     }
// );
//
// return json(d);
//
//
// return json({process: "OK"});


// import git from "isomorphic-git";
// import {json} from "@sveltejs/kit";
//
// console.log("Cloned");
//
// // Get list of all commits in repository
// const commits = (await git.log({fs, dir: "/", ref: "main", cache: cache})).toSorted(
//     (a, b) => b.commit.author.timestamp - a.commit.author.timestamp
// )
//
// // Checkout the latest commit
// await git.checkout(
//     {
//         fs,
//         dir: "/",
//         ref: commits[0].oid,
//         cache: cache
//     }
// );
// console.log("Checked out");
// const d1 = await git.listFiles(
//     {
//         fs,
//         dir: "/",
//         ref: commits[0].oid,
//         cache: cache
//     });
// return json(d1);