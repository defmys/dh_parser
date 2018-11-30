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

    configList.forEach(function(config) {
        let targetSet = null;

        switch (config.type) {
        case "Actor":
            targetSet = actors;
            break;
        case "Material":
            targetSet = materials;
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

function calcMaxIDs(configList) {
    let ret = {
        actor: 0,
        material: 0
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
            material: 0
        };
    }

    validate(rootPath) {
        const configList = loadConfigFile(rootPath);

        this.issueList = [];
        this.issueList = this.issueList.concat(checkID(configList));

        this.maxID = calcMaxIDs(configList);
    }

    issueCount() {
        return this.issueList.length;
    }
}
