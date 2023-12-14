import type {IFs} from "memfs";
import type {ReadCommitResult} from "isomorphic-git";
import git from "isomorphic-git";
import {hashCode, randomInt, stringToColour} from "$lib/utils";
import {DIRECTORY, FILE} from "$lib/icons";

export class CurrentCommitDataHolder {
    private fs: IFs = {} as IFs;
    private cache: {} = {};
    private commits: ReadCommitResult[] = []; // List of commits

    // Properties
    private oid = ''; // SHA-1 object id of the current commit
    private commitMessage = ''; // Commit message of the current commit
    private hierarchy = {}; // File system hierarchy
    // Data structure for the current commit, "TREEMAP" => {}
    private data = {};
    private stats = [];
    private filters = {};

    async init(fs: IFs, cache: {}, commits: ReadCommitResult[]) {
        this.fs = fs;
        this.cache = cache;
        this.commits = commits;

        // Load the current commit oid
        this.oid = await git.resolveRef({fs, dir: '/', ref: 'HEAD'});
        // Load the current commit message
        this.commitMessage = await git.readCommit({fs, dir: '/', oid: this.oid}).then((commit) => {
            return commit.commit.message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        });
        // Create hierarchy from the current commit file system tree
        const tree = await git.listFiles({fs, dir: '/', ref: this.oid});

        // Build the hierarchy with the current commit file system tree
        await this.buildHierarchy(tree);
        // Generate statistics for the current commit
        await this.generateStats(tree);

        // Convert the hierarchy to Tree-specific data structure
        await this.convertHierarchyToTree();
        await this.convertHierarchyToTreeVertical();
        await this.convertHierarchyToRadialTree();
        await this.convertHierarchyToDag();
        await this.convertHierarchyToForceDirected();
        await this.convertHierarchyToTreeMap();

        // Generate filters for the current commit
        await this.generateFilters();
    }

    public getData() {
        return {
            oid: this.oid,
            fs: this.hierarchy,
            stats: this.stats,
        }
    }

    static async generateCurrentCommitDataHolder(fs: IFs, cache: {}, commits: ReadCommitResult[]) {
        const holder = new CurrentCommitDataHolder();
        await holder.init(fs, cache, commits);
        // return holder.getData();
        return holder;
    }

    private async buildHierarchy(tree: string[]) {
        const hierarchy = {};
        for (const path of tree) {
            const parts = path.split('/');
            let current = hierarchy;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (i === parts.length - 1) {
                    current[part] = path;
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
                    children.push({
                        name: fileName, children: [],
                        itemStyle: {
                            color: stringToColour(extension)
                        }
                    });
                }
            }
            return {name, children};
        }
        tree['name'] = '/';
        tree['children'] = traverse(this.hierarchy, '/')['children'];
        // Remove values with empty children
        const removeEmptyChildren = (tree) => {
            if (tree['children'].length === 0) {
                delete tree['children'];
                tree["value"] = 0;
            } else {
                for (const child of tree['children']) {
                    removeEmptyChildren(child);
                }
            }
        }
        removeEmptyChildren(tree);
        this.data['tree'] = tree;

    }

    private async convertHierarchyToTreeVertical() {
        this.data['treeVertical'] = this.data['tree'];
    }

    private async convertHierarchyToRadialTree() {
        this.data['radialTree'] = this.data['tree'];
    }

    private async convertHierarchyToTreeMap() {
        const computedTree = this.data['tree'];


        this.data['treeMap'] = {
            levels: [],
            name: '/',
            children: [],
        }
    }

    private async convertHierarchyToForceDirected() {

    }

    private async convertHierarchyToDag() {
        const dag = {};
        // dag: { nodes: [{name:'/'}], links: [{source:'/', target:'lib'}] }
        dag['nodes'] = [];
        dag['links'] = [];

        // Lookuptable to save relative index of each node
        const lookupTable = {};
        const traverse = (dir, name) => {
            for (const item of Object.keys(dir)) {
                const extension = item.split('.').pop() || 'No Extension';
                const isObejct = typeof dir[item] === 'object';
                dag['nodes'].push({
                    id: hashCode(item),
                    x: randomInt(-200, 200),
                    y: randomInt(-200, 200),
                    name: item,
                    itemStyle: {
                        color: stringToColour(extension),
                        symbol: (value, params) => {
                            return isObejct ? DIRECTORY : FILE;
                        }
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
                if (isObejct) {
                    traverse(dir[item], item);
                }
            }
        }
        dag['nodes'].push({name: '/', id: hashCode('/'), x: 0, y: 0});
        traverse(this.hierarchy, '/');
        // Map links, source and target are relative to links array
        for (const link of dag['links']) {
            link.source = dag['nodes'].findIndex((node) => node.id === link.source);
            link.target = dag['nodes'].findIndex((node) => node.id === link.target);
        }
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