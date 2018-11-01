import fs from "fs";
import path from "path";


class TagImpl {
    get filename() {
        return "";
    }

    constructor() {
        this.tags = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../asset", this.filename), "utf8"));
    }
}


class ColorTagImpl extends TagImpl {
    get filename() {
        return "colorTag.json";
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


class MaterialTagImpl extends TagImpl {
    get filename() {
        return "materialTag.json";
    }
}


let _materialTag = null;
export class MaterialTag {
    static inst() {
        if (_materialTag === null) {
            _materialTag = new MaterialTagImpl();
        }

        return _materialTag;
    }
}
