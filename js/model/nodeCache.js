import fs from "fs";


let _nodeCache = null;

export class NodeCache {
    static inst() {
        if (_nodeCache === null) {
            _nodeCache = new NodeCache();
        }

        return _nodeCache;
    }

    constructor() {
        this.clear();
    }

    save(nodePath, content) {
        this._cache[nodePath] = content;
    }

    load(nodePath) {
        return this._cache[nodePath];
    }

    hasCache(nodePath) {
        return this._cache[nodePath] !== undefined;
    }

    clear() {
        this._cache = {};
    }

    remove(nodePath) {
        if (this._cache[nodePath]) {
            delete this._cache[nodePath];
        }
    }

    saveToDisk() {
        for (let nodePath in this._cache) {
            if (this._cache.hasOwnProperty(nodePath)) {
                try {
                    fs.writeFileSync(nodePath, JSON.stringify(this._cache[nodePath], null, 2));
                } catch(e) {
                    // 跳过保存失败的文件
                }
            }
        }

        this.clear();
    }
}
