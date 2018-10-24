import fs from "fs";
import path from "path";


class ColorTagImpl {
    constructor() {
        this.tags = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../asset/colorTag.json"), "utf8"));
    }
}


let _colorTag = null;
export class ColorTag {
    static inst() {
        if (_colorTag === null) {
            _colorTag = new ColorTagImpl();
        }

        return _colorTag;
    }
}
