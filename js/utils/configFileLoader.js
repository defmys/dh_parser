import fs from "fs";
import path from "path";


export function loadConfigFile(dirPath) {
    let dataList = [];

    if (fs.existsSync(dirPath)) {
        let nextList = fs.readdirSync(dirPath);
        if (nextList && nextList.length > 0) {
            nextList.forEach((next) => {
                if (next === "config.json") {
                    const configPath = path.resolve(dirPath, next);
                    let textContent = fs.readFileSync(configPath, "utf8");
                    let content = JSON.parse(textContent);
                    content["node_path"] = dirPath;
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
    }

    return dataList;
}
