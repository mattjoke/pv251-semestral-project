import type {IFs} from "memfs";
import git from "isomorphic-git";

export class CurrentCommitDataHolder {
    private fs: IFs = {} as IFs;
    private cache: {} = {};

    // Properties
    private oid = ''; // SHA-1 object id of the current commit
    private hierarchy = {}; // File system hierarchy
    private data = Map<string, {}>; // Data structure for the current commit, "TREEMAP" => {}
    async init(fs: IFs, cache: {}) {
        this.fs = fs;
        this.cache = cache;

        // Load the current commit oid
        this.oid = await git.resolveRef({fs, dir: '/', ref: 'HEAD'});
        // Create hierarchy from the current commit file system tree
        const tree = await git.listFiles({fs, dir: '/', ref: this.oid});
        // Build the hierarchy with the current commit file system tree
        await this.buildHierarchy(tree);

        // Convert the hierarchy to Tree-specific data structure
        await this.convertHierarchyToTree();
        await this.convertHierarchyToTreeVertical();
        await this.convertHierarchyToRadialTree();
        await this.convertHierarchyToDag();
        await this.convertHierarchyToForceDirected();
        await this.convertHierarchyToTreeMap();
    }

    public getData() {
        return {
            oid: this.oid,
            fs: this.hierarchy
        }
    }

    static async generateCurrentCommitDataHolder(fs: IFs, cache: {}) {
        const holder = new CurrentCommitDataHolder();
        await holder.init(fs, cache);
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

    private async convertHierarchyToTree() {

    }

    private async convertHierarchyToTreeVertical() {

    }

    private async convertHierarchyToRadialTree() {

    }

    private async convertHierarchyToTreeMap() {

    }

    private async convertHierarchyToForceDirected() {

    }

    private async convertHierarchyToDag() {

    }
}