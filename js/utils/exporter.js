import fs from "fs";
import path from "path";


function filterByType(configList, targetType) {
    let filtered = [];
    configList.forEach((value) => {
        if (value.type === targetType) {
            filtered.push(value);
        }
    });
    return filtered;
}


function loadConfigFile(dirPath) {
    let dataList = [];

    let nextList = fs.readdirSync(dirPath);
    if (nextList && nextList.length > 0) {
        nextList.forEach((next) => {
            if (next === "config.json") {
                const configPath = path.resolve(dirPath, next);
                let textContent = fs.readFileSync(configPath, "utf8");
                let content = JSON.parse(textContent);
                dataList.push(content);
            } else {
                const curPath = path.resolve(dirPath, next);
                let stat = fs.statSync(curPath);
                if (stat.isDirectory()) {
                    dataList = dataList.concat(loadConfigFile(curPath, next));
                }
            }
        });
    }

    return dataList;
}


function exportToFile(rootPath, contentList, type, dbCollection) {
    let targetContentList = filterByType(contentList, type);
    let stringList = targetContentList.map((value) => {return JSON.stringify(value);});

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
