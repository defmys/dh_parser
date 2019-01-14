import {loadConfigFile} from "./configFileLoader";


class Issue {
    constructor(path, errorMsg) {
        this.path = path;
        this.errorMsg = errorMsg;
    }
}


function checkID(configList) {
    let issueList = [];

    let actors = new Set();
    let materials = new Set();
    let rooms = new Set();

    configList.forEach(function(config) {
        let targetSet = null;

        switch (config.type) {
        case "Actor":
            targetSet = actors;
            break;
        case "Material":
            targetSet = materials;
            break;
        case "Room":
            targetSet = rooms;
            break;
        default:
            break;
        }

        if (targetSet !== null) {
            if (config.id <= 0) {
                issueList.push(new Issue(config.node_path, "ID 小于等于0"));
            }
            else if (targetSet.has(config.id)) {
                issueList.push(new Issue(config.node_path, "ID 冲突"));
            } else {
                targetSet.add(config.id);
            }
        }
    });

    return issueList;
}


function checkRefPath(issueList, config) {
    if (config.type === "Room") {
        checkRoomRefPath(issueList, config);
    } else if (config.ref_path !== undefined && config.ref_path !== null) {
        if (!config.ref_path.startsWith("/Game/")) {
            issueList.push(new Issue(config.node_path, "引用路径格式错误"));
        }
    }
}


function checkRoomRefPath(issueList, config) {
    if (!config.ref_path) {
        issueList.push(new Issue(config.node_path, "缺少房间引用路径"));
    }
    else {
        if (config.is_dat) {
            if (config.ref_path.includes("/") || config.ref_path.includes("\\")) {
                issueList.push(new Issue(config.node_path, "房间存档引用路径中包含有文件夹"));
            }
            if (!config.ref_path.endsWith(".dat")) {
                issueList.push(new Issue(config.node_path, "房间存档引用路径不是dat文件"));
            }
        } else {
            if (config.ref_path.includes("/") || config.ref_path.includes("\\")) {
                issueList.push(new Issue(config.node_path, "房间引用路径中包含有文件夹"));
            }
            if (!config.ref_path.endsWith(".umap")) {
                issueList.push(new Issue(config.node_path, "房间引用路径不是umap文件"));
            }
        }
    }
}


function checkTextureRefPath(issueList, config) {
    if (config.texture_ref_path) {
        config.texture_ref_path.forEach(function(ref_path) {
            if (!ref_path.startsWith("/Game/") && ref_path !== "") {
                issueList.push(new Issue(config.node_path, "贴图引用路径格式错误"));
            }
        });
    }
}


function checkUninitializedConfig(issueList, config) {
    if (!config.hasOwnProperty("id")) {
        issueList.push(new Issue(config.node_path, "配置文件未初始化"));
    }
}


function checkThumbnail(issueList, config) {
    if (config.thumbnail === "") {
        issueList.push(new Issue(config.node_path, "缺少缩略图"));
    }
}


function calcMaxIDs(configList) {
    let ret = {
        actor: 0,
        material: 0,
        room: 0,
    };

    configList.forEach(function(config) {
        switch (config.type) {
        case "Actor":
            if (ret.actor < config.id) {
                ret.actor = config.id;
            }
            break;
        case "Material":
            if (ret.material < config.id) {
                ret.material = config.id;
            }
            break;
        case "Room":
            if (ret.room < config.id) {
                ret.room = config.id;
            }
            break;
        default:
            break;
        }
    });

    return ret;
}

export class Validator {
    constructor() {
        this.issueList = [];
        this.maxID = {
            actor: 0,
            material: 0,
            room: 0
        };
    }

    validate(rootPath) {
        const configList = loadConfigFile(rootPath);

        this.issueList = [];
        this.issueList = this.issueList.concat(checkID(configList));

        let _this = this;
        configList.forEach(function(config) {
            checkUninitializedConfig(_this.issueList, config);
            checkRefPath(_this.issueList, config);
            checkTextureRefPath(_this.issueList, config);
            checkThumbnail(_this.issueList, config);
        });

        this.maxID = calcMaxIDs(configList);
    }

    issueCount() {
        return this.issueList.length;
    }
}
