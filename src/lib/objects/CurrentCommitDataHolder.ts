// @ts-nocheck
import type {IFs} from "memfs";
import type {ReadCommitResult} from "isomorphic-git";
import git from "isomorphic-git";
import {hashCode, randomInt, stringToColour} from "$lib/utils";
import {DIRECTORY, FILE} from "$lib/icons";


export class CurrentCommitDataHolder {
    fs: IFs = {} as IFs;
    cache: {} = {};
    commits: ReadCommitResult[] = []; // List of commits

    // Properties
    oid = ''; // SHA-1 object id of the current commit
    private commitMessage = ''; // Commit message of the current commit
    private commitAuthor = ''; // Commit author of the current commit
    private hierarchy = {}; // File system hierarchy
    // Data structure for the current commit, "TREEMAP" => {}
    private data = {};
    private stats = [];
    private filters = {};
    private fileCache = {};

    // Tree file structure of the every commit
    commitFS = {};

    async init(fs: IFs, cache: {}, commits: ReadCommitResult[]) {
        await this.initWithSpecificCommit(fs, cache, commits, commits[0].oid);
    }

    async initWithSpecificCommit(fs: IFs, cache: {}, commits: ReadCommitResult[], oid: string) {
        this.fs = fs;
        this.cache = cache;
        this.commits = commits;

        // Load the current commit oid
        await this.checkout(oid)
    }

    // Checkout to another commit
    async checkout(oid: string) {
        this.oid = oid;
        // Load the current commit message
        this.commitMessage = await git.readCommit({fs: this.fs, dir: '/', oid: this.oid}).then((commit) => {
            return commit.commit.message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        });
        this.commitAuthor = await git.readCommit({fs: this.fs, dir: '/', oid: this.oid}).then((commit) => {
            return commit.commit.author.name;
        });

        // Create hierarchy from the current commit file system tree
        const tree = await git.listFiles({fs: this.fs, dir: '/', oid: this.oid})
        // Build the hierarchy with the current commit file system tree
        await this.buildHierarchy(tree);
        // Generate statistics for the current commit
        await this.generateStats(tree);
        // Convert the hierarchy to Tree-specific data structure
        await this.convertHierarchyToTree();
        await this.convertHierarchyToDag();
        await this.convertHierarchyToTreeMap();
        // Generate filters for the current commit
        await this.generateFilters();
    }

    public getData() {
        return {
            oid: this.oid,
            fs: this.hierarchy,
            stats: this.stats,
            filters: this.filters,
            data: this.data,
            commits: this.commits,
            commitMessage: this.commitMessage,
            commitAuthor: this.commitAuthor
        }
    }

    static async generateCurrentCommitDataHolderWithSpecificCommit(fs: IFs, cache: {}, commits: ReadCommitResult[], commit: ReadCommitResult) {
        const holder = new CurrentCommitDataHolder();
        await holder.initWithSpecificCommit(fs, cache, commits, commit.oid);
        return holder;
    }

    static async generateCurrentCommitDataHolder(fs: IFs, cache: {}, commits: ReadCommitResult[]) {
        const holder = new CurrentCommitDataHolder();
        await holder.init(fs, cache, commits);
        return holder;
    }

    public async generateCommitFSWithHistory() {
        // Create a file system tree for each commit
        const commitFS = {};
        for (const commit of this.commits) {
            // if (commit.oid === this.oid) continue;
            commitFS[commit.oid] = await CurrentCommitDataHolder.generateCurrentCommitDataHolderWithSpecificCommit(this.fs, this.cache, this.commits, commit);
        }
        this.commitFS = commitFS;
    }

    private async buildHierarchy(tree: string[]) {
        const hierarchy = {};
        for (const path of tree) {
            const parts = path.split('/');
            let current = hierarchy;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (i === parts.length - 1) {
                    // Get the size of the path
                    current[part] = path;
                    const stats = this.fs.statSync(`/${path}`);
                    this.fileCache[path] = {
                        size: stats.size,
                        mode: stats.mode,
                        mtime: stats.mtime,
                        ctime: stats.ctime,
                        birthtime: stats.birthtime,
                        fileName: path
                    };
                } else {
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }
            }
        }
        this.hierarchy = hierarchy;
    }

    public getStats() {
        return this.stats;
    }

    private async convertHierarchyToTree() {
        // Create a tree data structure in following format: {name: '', children: []}
        const tree = {};
        const traverse = (dir, name) => {
            const children = [];
            for (const item of Object.keys(dir)) {
                if (typeof dir[item] === 'object') {
                    children.push(traverse(dir[item], item));
                } else {
                    const fileName = item.split('/').pop();
                    const extension = fileName.split('.').pop() || 'No Extension';
                    const fileSize = this.fileCache[dir[item]].size;
                    children.push({
                        name: fileName,
                        value: fileSize,
                        children: [],
                        itemStyle: {
                            color: stringToColour(extension)
                        }
                    });
                }
            }
            // Compute size of the current directory
            let size = 0;
            for (const child of children) {
                size += child.value;
            }
            return {name, children, value: size};
        }
        tree['name'] = '/';
        const childrenRoot = traverse(this.hierarchy, '/');
        tree['children'] = childrenRoot['children'];
        tree['value'] = childrenRoot['value'];
        // Remove values with empty children
        const removeEmptyChildren = (tree) => {
            if (tree['children'].length === 0) {
                delete tree['children'];
            } else {
                for (const child of tree['children']) {
                    removeEmptyChildren(child);
                }
            }
        }
        removeEmptyChildren(tree);
        this.data['tree'] = tree;
    }

    private async convertHierarchyToTreeMap() {
        const computedTree = this.data['tree'];
        // Add full path to each node
        const traverse = (tree, path) => {
            tree['path'] = path;
            if (tree['children']) {
                for (const child of tree['children']) {
                    traverse(child, `${path}/${child['name']}`);
                }
            }
        }
        traverse(computedTree, '/');
        this.data['treeMap'] = computedTree;
    }

    private async convertHierarchyToDag() {
        const dag = {};
        // dag: { nodes: [{name:'/'}], links: [{source:'/', target:'lib'}] }
        dag['nodes'] = [];
        dag['links'] = [];

        const traverse = (dir, name) => {
            for (const item of Object.keys(dir)) {
                const extension = item.split('.').pop() || 'No Extension';
                const isObject = typeof dir[item] === 'object';
                let fileSize = 0;
                dag['nodes'].push({
                    id: hashCode(item),
                    x: randomInt(-200, 200),
                    y: randomInt(-200, 200),
                    path: dir[item],
                    name: item,
                    symbol: isObject ? DIRECTORY : FILE,
                    symbolSize: isObject ? Object.keys(dir[item]).length * 5 : 10,
                    itemStyle: {
                        color: stringToColour(extension),
                    }
                });
                dag['links'].push(
                    {
                        source: hashCode(name),
                        target: hashCode(item),
                        label: {
                            formatter: `${name} -> ${item}`
                        }
                    }
                );
                if (isObject) {
                    traverse(dir[item], item);
                }
            }
        }
        dag['nodes'].push({
            name: '/',
            id: hashCode('/'),
            x: 0,
            y: 0,
            symbol: DIRECTORY,
            symbolSize: Object.keys(this.hierarchy).length * 5
        });
        traverse(this.hierarchy, '/');
        // Map links, source and target are relative to links array
        for (const link of dag['links']) {
            link.source = dag['nodes'].findIndex((node) => node.id === link.source);
            link.target = dag['nodes'].findIndex((node) => node.id === link.target);
        }

        // Update value of nodes, values are taken from the fileCache, links are taken from the hierarchy
        for (const node of dag['nodes']) {
            if (typeof node.path === 'object') {
                node.value = 0;
                for (const item of Object.keys(node.path)) {
                    node.value += this.fileCache[node.path[item]]?.size ?? 0;
                }
            } else {
                node.value = this.fileCache[node.path]?.size ?? 0;
            }
        }

        // Calculate the size of the root node, connectlted like in tree
        const root = dag['nodes'].find((node) => node.name === '/');
        const traverseRoot = (dir) => {
            for (const item of Object.keys(dir)) {
                if (typeof dir[item] === 'object') {
                    traverseRoot(dir[item]);
                } else {
                    root.value += this.fileCache[dir[item]]?.size ?? 0;
                }
            }
        }
        traverseRoot(this.hierarchy);
        this.data['dag'] = dag;

    }

    private async generateFilters() {
        // Generate filters for the current commit, using stats
        const filters = {};
        for (const stat of this.stats) {
            for (const key of Object.keys(stat)) {
                if (key === 'total' || key === "files" || key === 'directory') {
                    continue;
                }
                filters[key] = (filters[key] ?? 0) + stat[key];
            }
        }
        this.filters = filters;
    }

    private async generateStats(tree) {
        const fileTypeCounts = {};
        fileTypeCounts['total'] = tree.length;
        const traverse = (dir) => {
            for (const item of Object.keys(dir)) {
                if (typeof dir[item] === 'object') {
                    fileTypeCounts['directory'] = (fileTypeCounts['directory'] ?? 0) + 1;
                    traverse(dir[item]);
                } else {
                    const extension = dir[item].split('.').pop();
                    if (extension === dir[item]) {
                        fileTypeCounts['noExtension'] = (fileTypeCounts['noExtension'] ?? 0) + 1;
                        continue;
                    }
                    fileTypeCounts[extension] = (fileTypeCounts[extension] ?? 0) + 1;
                    fileTypeCounts['files'] = (fileTypeCounts['files'] ?? 0) + 1;
                }
            }
        }
        traverse(this.hierarchy);
        this.stats.push(fileTypeCounts);
    }
}