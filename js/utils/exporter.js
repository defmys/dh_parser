import fs from "fs";
import path from "path";
import {loadConfigFile} from "./configFileLoader";


function filterByType(configList, targetType) {
    let filtered = [];
    configList.forEach((value) => {
        if (value.type === targetType && value.id > 0) {
            filtered.push(value);
        }
    });
    return filtered;
}


function exportToFile(rootPath, contentList, type, dbCollection) {
    let targetContentList = filterByType(contentList, type);
    let stringList = targetContentList.map((value) => {
        delete value.node_path;
        return JSON.stringify(value);
    });

    let scriptContent = [];

    scriptContent.push(`db.${dbCollection}.deleteMany({});`);

    scriptContent.push(`db.${dbCollection}.insertMany([`);
    scriptContent.push(stringList.join(",\n"));
    scriptContent.push("]);");

    fs.writeFileSync(path.resolve(rootPath, `export_${type}.js`), scriptContent.join("\n"));
}


export function exportScript(rootPath) {
    let configList = loadConfigFile(rootPath);

    exportToFile(rootPath, configList, "Actor", "actor");
    exportToFile(rootPath, configList, "Material", "material");
}
