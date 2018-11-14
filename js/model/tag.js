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



const _colorCheckboxStyle = {
    "1": {fontWeight: "bold"},
    "2": {fontWeight: "bold", backgroundColor: "#3366ff", color: "white", textShadow: "1px 1px 0px #000000"},
    "3": {fontWeight: "bold", backgroundColor: "#996600", color: "white", textShadow: "1px 1px 0px #000000"},
    "4": {fontWeight: "bold", backgroundColor: "#00e600", color: "white", textShadow: "1px 1px 0px #000000"},
    "5": {fontWeight: "bold", backgroundColor: "#ffff33"},
    "6": {fontWeight: "bold", backgroundColor: "#ffad33"},
    "7": {fontWeight: "bold", backgroundColor: "#ffb3ff"},
    "8": {fontWeight: "bold", backgroundColor: "#b84dff", color: "white", textShadow: "1px 1px 0px #000000"},
    "9": {fontWeight: "bold", backgroundColor: "#ff3300", color: "white", textShadow: "1px 1px 0px #000000"}
};

let _colorTag = null;
export class ColorTag {
    static inst() {
        if (_colorTag === null) {
            _colorTag = new ColorTagImpl();
        }

        return _colorTag;
    }

    static getCheckboxStyle(colorTagIdx) {
        const idx = colorTagIdx.toString();
        if (_colorCheckboxStyle.hasOwnProperty(idx)) {
            return _colorCheckboxStyle[idx];
        }

        return {};
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


class MajorTagImpl extends TagImpl {
    get filename() {
        return "majorTag.json";
    }
}


let _majorTag = null;
export class MajorTag {
    static inst() {
        if (_majorTag === null) {
            _majorTag = new MajorTagImpl();
        }

        return _majorTag;
    }
}


class SubTagImpl extends TagImpl {
    get filename() {
        return "subTag.json";
    }
}


let _subTag = null;
export class SubTag {
    static inst() {
        if (_subTag === null) {
            _subTag = new SubTagImpl();
        }

        return _subTag;
    }
}


class tagHierarchyImpl extends TagImpl {
    get filename() {
        return "tagHierarchy.json";
    }
}


let _tagHierarchy = null;
export class TagHierarchy {
    static inst() {
        if (_tagHierarchy === null) {
            _tagHierarchy = new tagHierarchyImpl();
        }

        return _tagHierarchy;
    }
}


class MaterialKeywordImpl extends TagImpl {
    get filename() {
        return "materialKeyword.json";
    }
}


let _materialKeyWord = null;
export class MaterialKeyword {
    static inst() {
        if (_materialKeyWord === null) {
            _materialKeyWord = new MaterialKeywordImpl();
        }

        return _materialKeyWord;
    }
}


class MaterialHierarchyImpl extends TagImpl {
    get filename() {
        return "materialHierarchy.json";
    }
}


let _materialHierarchy = null;
export class MaterialHierarchy {
    static inst() {
        if (_materialHierarchy === null) {
            _materialHierarchy = new MaterialHierarchyImpl();
        }

        return _materialHierarchy;
    }
}
